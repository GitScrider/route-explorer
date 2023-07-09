FROM python:3
WORKDIR /app
COPY . /app
EXPOSE 800
CMD ["pyhton","-m","http.server","8000"]