version: '3.9'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: backend
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
    depends_on:
      - myDB
    networks:
      - app-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend
    ports:
      - "4200:80"
    networks:
      - app-network
    depends_on:
      - backend

  myDB:
    image: postgres:15
    container_name: my-database
    restart: always
    ports:
      - 5432:5432
    environment:
      - POSTGRES_USER=createga
      - POSTGRES_PASSWORD=123456
      - POSTGRES_DB=prueba_db
    volumes:
      - ./postgres:/var/lib/postgresql/data
    networks:
      - app-network

  pgAdmin:
    image: dpage/pgadmin4
    container_name: pgadmin4
    restart: always
    depends_on:
      - myDB
    ports:
      - 8080:80
    environment:
      - PGADMIN_DEFAULT_EMAIL=createga@prueba.com
      - PGADMIN_DEFAULT_PASSWORD=123456
    volumes:
      - ./pgadmin:/var/lib/pgadmin
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
