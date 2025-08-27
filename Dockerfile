# Etapa 1: Build Angular con Node 20
FROM node:20 AS angular-build
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY helloangularnet.client/package*.json ./helloangularnet.client/
WORKDIR /app/helloangularnet.client
RUN npm install -g @angular/cli@19.2.13
RUN npm install --legacy-peer-deps

# Copiar todo el frontend y compilar Angular
COPY helloangularnet.client/. .
RUN ng build --configuration production

# Etapa 2: Build .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-build
WORKDIR /src

# Copiar solución y proyecto backend
COPY HelloANgularNet.sln ./
COPY HelloANgularNet.Server ./HelloANgularNet.Server

# Restaurar paquetes y publicar
WORKDIR /src/HelloANgularNet.Server
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Copiar build de Angular a wwwroot de .NET
RUN rm -rf /app/publish/wwwroot/*
COPY --from=angular-build /app/helloangularnet.client/dist/helloangularnet.client/browser/ /app/publish/wwwroot/


# Etapa 3: Runtime .NET
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=dotnet-build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "HelloANgularNet.Server.dll"]
