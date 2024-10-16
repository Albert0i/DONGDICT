 
FROM mcr.microsoft.com/windows/nanoserver:20H2

ENV NODE_VERSION=18.16.1
 
WORKDIR /app
 
ENV PATH="C:\Windows\system32;C:\Windows;C:\app\node-v18.16.1-win-x64;"
 
# because we don't have PowerShell, we will install using CURL and TAR
# running one command reduced the size form 1.08 GB to ~765 MB on NanoServer:1903
# running on Server Core is ~ 5.61 GB
COPY package.json .env /app/
RUN curl.exe -o node-v18.16.1-win-x64.zip -L https://nodejs.org/dist/v18.16.1/node-v18.16.1-win-x64.zip && \
    tar.exe -xf node-v18.16.1-win-x64.zip && \
    DEL node-v18.16.1-win-x64.zip &&\
    npm install 

COPY src /app/src
CMD [ "node.exe", "c:\\app\\src\\app.js"]

# 
# Reference:
# Running a Node / Angular Application in a container based on Windows Nano Server
# https://kevinsaye.wordpress.com/2019/08/06/running-a-node-angular-application-in-a-container-based-on-windows-nano-server/
#
# docker build -t albert0i/jest-course . --no-cache
# docker run --name jest-course --rm -d -p 3000:3000 albert0i/jest-course
#
# docker exec -it jest-course cmd
# docker container stop jest-course
#
# EOF (2024/10/18)
#