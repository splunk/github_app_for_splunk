# Container image that runs your code
FROM python:3.8-slim-buster

# Copies your code file from your action repository to the filesystem path `/` of the container
COPY entrypoint.sh /entrypoint.sh
COPY post_to_splunk.py /post_to_splunk.py

RUN ls -al /home/runner/runners/

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]
