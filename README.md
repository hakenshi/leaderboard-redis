# Leaderboard, exemplo de aplicação em tempo real usando redis.

#Instruções: 
1. Instale as depencências utilizando o npm no frontend e na pasta api. #É necessário ter o cli do nestjs instalado.
2. crie um arquivo .env e cole a seguinte variável de ambiente: DATABASE_URL="postgresql://user:password@localhost:5432/leaderboard?schema=public"
3. Dentro da pasta api, inicie os bancos de dados com o docker utilizando docker compose up -d.
4. Puxe o esquema do banco de dados postgres com npx prisma db push
5. Para popular o banco de dados rode o arquivo seed.ts em api/src/prisma/seed.ts
6. volte para a pasta raiz do projeto.
7. Em um terminal inicie a api com o comando npm run api
8. em outro terminal rode o comando npm run dev para iniciar o frontend.

