#Step1: Base Images
FROM python:3.9

#Step2: Package Install
RUN apt -y update; apy -y upgrade; apt -y install vim git net-tools

#Step3: Specify a Working directory
WORKDIR /root

#Step4 : Config file copy
COPY .bashrc .
COPY .exrc .
COPY hello.py .
RUN pip install bottle

#Step5: Open port
EXPOSE 3000

#Step 6 : Execution Program
CMD ["python", "hello.py"]