#Lambda Function

import json
import csv
import boto3
def lambda_handler(event, context):
    s3 = boto3.client('s3')
    
    response = s3.get_object(Bucket='cs4990-emails',Key="public/my_emails.csv")
    csv_data = response['Body'].read().decode('utf-8')
    reader = csv.reader(csv_data.splitlines(), delimiter=',')
    temp = []
    emailList = []
    for row in reader:
        temp.append(row)
    for i in temp:
        emailList.append(i[0])
    print(emailList)
    
    
    def sendEmail(toEmail, subject, body):
        ses = boto3.client('ses')
        fromEmail = "<main email>"
        CHARSET = "UTF-8"

        response = ses.send_email(
            Destination={
                   'ToAddresses': [
                       toEmail,
                    ],
               },
            Message={
                    'Body': {
                        'Html': {
                            'Charset': CHARSET,
                            'Data': body,
                        },
                    },
                    'Subject': {
                        'Charset': CHARSET,
                        'Data': subject,
                    },
                },
            Source=fromEmail,
        )
        return response;

    for i in emailList:
        sendEmail(i,event["title"],event["body"])
