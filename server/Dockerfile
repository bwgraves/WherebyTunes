FROM mcr.microsoft.com/playwright

# Install ffmpeg
RUN apt update
RUN apt install ffmpeg

# Create the working directory
RUN mkdir -p /home/pwuser/app && chown -R pwuser:pwuser /home/pwuser/app
WORKDIR /home/pwuser/app

COPY package*.json ./

RUN npm install

COPY --chown=pwuser:pwuser . .

EXPOSE 5000

CMD ["node", "app.js"]