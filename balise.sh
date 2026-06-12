#!/bin/bash
# Script de gestion de l'environnement de dev Balise
# Lance Postgres (via le postgres-dev partagé) + Redis, puis l'app

POSTGRES_DIR=~/postgres-dev
REDIS_CONTAINER=redis-dev
DB_NAME=balise

case "$1" in
  start)
    echo "🚀 Démarrage de l'environnement Balise..."

    # 1. Postgres partagé
    echo "→ PostgreSQL..."
    (cd "$POSTGRES_DIR" && ./pg.sh start)

    # 2. Créer la base balise si elle n'existe pas
    echo "→ Vérification de la base '$DB_NAME'..."
    docker exec postgres-dev psql -U postgres -tc \
      "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 \
      || docker exec postgres-dev psql -U postgres -c "CREATE DATABASE $DB_NAME;"

    # 3. Redis (créé s'il n'existe pas, démarré sinon)
    echo "→ Redis..."
    if [ "$(docker ps -aq -f name=^${REDIS_CONTAINER}$)" ]; then
      docker start "$REDIS_CONTAINER" > /dev/null
    else
      docker run -d --name "$REDIS_CONTAINER" -p 6379:6379 redis:7-alpine > /dev/null
    fi

    echo ""
    echo "✅ Environnement prêt"
    echo "   PostgreSQL : localhost:5432 (base: $DB_NAME)"
    echo "   Redis      : localhost:6379"
    echo ""
    echo "Lance maintenant l'app avec : pnpm dev"
    echo "Et le worker dans un autre terminal : pnpm dev:worker"
    ;;

  stop)
    echo "🛑 Arrêt de l'environnement Balise..."
    docker stop "$REDIS_CONTAINER" > /dev/null 2>&1 && echo "→ Redis arrêté"
    echo "→ PostgreSQL laissé tourner (partagé avec d'autres projets)"
    echo "  Pour l'arrêter aussi : cd $POSTGRES_DIR && ./pg.sh stop"
    ;;

  dev)
    "$0" start
    echo "🔧 Lancement de l'app..."
    pnpm dev
    ;;

  logs)
    docker logs -f "$REDIS_CONTAINER"
    ;;

  *)
    echo "Usage: ./balise.sh {start|stop|dev|logs}"
    echo ""
    echo "  start  - Démarre Postgres + crée la base + Redis"
    echo "  stop   - Arrête Redis (laisse Postgres tourner)"
    echo "  dev    - Démarre tout PUIS lance l'app + worker"
    echo "  logs   - Logs de Redis"
    exit 1
    ;;
esac
