const macros = {
  "Changing Offers/Add ons": {
    template: (data, phone, comment) => `
Client / TA called in to request changing of add-ons/offers\n 
Client Name: **${data.clientName || ""}**
Lead ID: **${data.leadId || ""}**
National ID: **${data.nationalId || ""}**
Input name: **N/A**
Quantity: **N/A**

Comments:
Caller Phone: **${phone}**
${comment}
      `,
    comments: [
      {
        label: "🟩 Unlocking then Locking Addons",
        message: `The TA called to request assistance with unlocking the client's add-ons so they could add more products. 
I provided the requested support, allowed the TA to make the necessary adjustments, and then confirmed that the add-ons were correctly updated in PAYGOPS before locking them again.`,
      },
      {
        label: "🟨 Unlocking Addons Only",
        message: `The TA called to request assistance with unlocking the client's add-ons so they could add more products. 
I fulfilled the TA's request.`,
      },
      {
        label: "🟪 Locking Addons",
        message: `TA called back to request help with saving and locking a client's add-ons after updating them. 
I confirmed that the add-ons were properly adjusted in PAYGOPS and assisted with locking them as shown below.`,
      },
      {
        label: "🟪 Offer Changes",
        message: `TA called to request assistance in changing client from Individual offer to Group loan. 
I assisted as requested. `,
      },
    ],
  },

  "Delivery Schedule Inquiry": {
    template: (data, phone, comment) => `
Client called to inquire when they will receive products enrolled for. \n   
Lead ID: **${data.leadId || ""}**
Account Number: **${data.accountNumber || ""}**
Sales Territory: **${data.salesTerritory || ""}**
Duka: **${data.dukaZone || ""}**
Current Status: **${data.status || ""}**

Comments:
Caller Phone: **${phone}**
${comment}
      `,
    comments: [
      {
        label: "🟩 Patience",
        message: `Client called to inquire about the delivery of their enrolled products. 
Confirmed that they will receive an SMS notification with collection details. Validated the phone number on PaygOps to ensure they receive the communication. Advised the client to remain patient and check their messages regularly for updates.`,
      },
    ],
  },

  "Phone Number Change": {
    template: (data, phone, comment) => `
This macro should be used to record requests to change phone numbers.\n  
Lead ID: **${data.leadId || ""}**
Account: **${data.accountNumber || ""}**
Sales Territory: **${data.salesTerritory || ""}**
Current phone number: **${data.phoneNumber || ""}**
New Phone number:
Retain the previous number?: No
Reason for changing: 

Comments:
Caller Phone: **${phone}**
${comment}
      `,
    comments: [
      {
        label: "🟥 Non Account holder calls on behalf of client",
        message: `TA called to request a phone number change for a client. 
I informed him that phone number changes must be requested directly by the client for security reasons. 
I advised him to have the client call personally to make the request.`,
      },
      {
        label: "🟩 Successful change",
        message: `The client called to request a phone number change. 
I verified their identity and changed the phone number on PaygOps and informed the client to send the OTP to the TA once they received it.`,
      },
      {
        label: "🟨 No access rights",
        message: `The client called to request a phone number change. 
I verified their identity but was unable to proceed with the update due to limited access rights. 
Kindly assist in updating the phone number.`,
      },
      {
        label: "🟪 Wrong answers when confirming identity",
        message: `The client called to request a phone number change. 
Client provided the wrong answers when verifying their identity. I advised they called back with the right answers.`,
      },
    ],
  },
  "Lead is not Qualified": {
    template: (data, phone, comment) => `
Lead ID: **${data.leadId || ""}**
Account: **${data.accountNumber || ""}**
Current Status: **${data.status || ""}**

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟦 Lead not qualified - roster balance",
        message: `TA called to inquire about the client's zero credit limit. 
After checking, I confirmed that the client has an outstanding loan balance on Roster. 
I provided the loan balance details, including the account number and the correct paybill number for repayment on core accounts.`,
      },
      {
        label: "🟪 Lead not qualified - paygops balance",
        message: `TA called to inquire about the client's zero credit limit. 
After checking, I confirmed that the client has an existing loan balance on Paygops and shared the loan balance details.`,
      },
      {
        label: "🟨 Client has no loan balance but stuck here",
        message: `TA called to inquire about the client's zero credit limit. 
After checking, I confirmed that the client has no existing loan balance on Paygops or Roster but status was stuck there despite several attempts at trouleshooting. 
Kindly assist.`,
      },
      {
        label: "🟥 Client has pending balances",
        message: `A called to inquire why client had zero credit, I tried to troubleshoot the error but it persisted. 
The client has a pending balance that should be reconciled to his account. 
Kindly assist.`,
      },
    ],
  },
  "Group Information Change/Addition Request": {
    template: (data, phone, comment) => `
This macro should be used to record cases of clients/TAs calling to request a change of group name details, add a client to a group, or confirm his / her group name. GL change requests should not be recorded here. \n  
Client Name: **${data.clientName || ""}**
Lead ID: **${data.leadId || ""}**
Account Number: **${data.accountNumber || ""}**
Correct group Name: ${data.correctGroupName || "N/A"}
Wrong group Name: ${data.wrongGroupName || "N/A"}
Territory: **${data.salesTerritory || ""}**
Comment on the status: **${data.comment || ""}**

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟨 Group Change Request",
        message: `TA called to request a group change for the client. 
I temporarily moved the status back to "Interested" to allow the update, then returned it to "Delivery Planning" after the change was made.`,
      },
      {
        label: "🟪 Status Update After Group Addition",
        message: `TA called to request assistance with moving a client's status. 
I confirmed that the client was not in a group and advised them to add the client.`,
      },
      {
        label: "🟥 Group Not Qualified",
        message: `Client inquired about delivery but the group was not qualified. 
I advised he/she contact TA for help joining another qualified group.`,
      },
      {
        label: "🟦 Enrollment Window Closed",
        message: `Client called to ask why they hadn’t received pickup message. 
I confirmed the group’s enrollment window had passed and advised them to reach out to the TA for assistance.`,
      },
    ],
  },

  "Payment Tracking": {
    template: (data, phone, comment) => `
Mpesa Code:
Repayment Date:
Payment Phone Number:
Payment Amount:
Payment Mode: USSD/Paybill:
The Paybill Number Paid to:
The correct farmer Account:  **${data.nationalId || ""}**
Correct Contract ID:
Lead ID: **${data.leadId || ""}**

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 Payment Reconciled",
        message: `The client called to confirm a payment. 
Checked PaygOps and confirmed the payment is correctly reconciled to the client's account. 
Shared feedback. Case solved on FCR.`,
      },
      {
        label: "🟩 Pending Payments",
        message: `The client called to confirm a payment.
Checked PaygOps and confirmed the payment is on the client's payments but marked as pending. 
Kindly assist in reconciling the payment.`,
      },
      {
        label: "🟪 Payment Not Found (Escalation)",
        message: `Client called regarding a payment that is not found on PaygOps. 
Checked the Buy Goods statement using available details, and I managed to locate the payment below. Kindly Assist.`,
      },
      {
        label: "🟦 Statement Delay (Escalation)",
        message: `Client called regarding tracking a payment. 
Statement is not yet uploaded. Informed the client that we will reach out with feedback within 2 working days. Kindly Assist.`,
      },
      {
        label: "🟥 Details Missing (FCR)",
        message: `The client called regarding a payment that is not found on PaygOps or the statement. 
        Advised the client to provide the correct details (transaction code, payment date, amount) and call back for further assistance.`,
      },
      {
        label: "🟨 Client Disconnected (Escalation)",
        message: `Client called regarding a payment but disconnected before receiving feedback. Kindly Assist.’`,
      },

      {
        label: "🟨 Balances not deducted but in account - Yvonne",
        message: `Client called regarding tracking a payment. Kindly assist in reconciling the payment to the current loan to ensure it deducts the loan’`,
      },
    ],
  },

  "Client Information Update": {
    template: (data, phone, comment) => `
This macro should be used when a client or TA calls to inquire about a client's status, claims that the status is stuck at "Ready to Start Qualification," or requests to add a missing phone number to the clients’ account. \n  
Client Name: **${data.clientName || ""}**
Phone number: **${data.phoneNumber || ""}**
Account Number: **${data.accountNumber || ""}**
Lead ID: **${data.leadId || ""}**
Zone: **${data.salesTerritory || ""}**
Current Status: **${data.status || ""}**
Comment on the status: **${data.comment || ""}**

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟥 Client status stuck",
        message: `TA called to inquire about a client's status, stating that it was stuck at "Ready to Start Qualification." 
I was able to assist and successfully moved the status to "Awaiting Delivery Planning."`,
      },
      {
        label: "🟪 Add missing phone number",
        message: `TA called requesting help to add a missing phone number to the farmer's account, as they were unable to add it on their side.`,
      },
    ],
  },

  "Solar Product Activation Codes": {
    template: (data, phone, comment) => `
Account Number: **${data.accountNumber || ""}**
Lead ID: **${data.leadId || ""}**
Lamp type:
Serial Number:
Duka of purchase: **${data.dukaZone || ""}**
Year of Issue:
Phone number to be reached: **${data.phoneNumber || ""}**

Comments:
Caller Phone: **${phone}**
The activation code was: 
${comment}
      `,
    comments: [
      {
        label: "🟩 Activation Codes Success",
        message: `The TA/client called to request the activation code for the Energy Biolite Home System. 
I asked for the lamp's serial number and checked the Duka Warranty - Activation Codes (under the Solar Activation Codes tab) to find the code. 
I then read out the activation code to them.`,
      },
      {
        label: "🟥 Activation Codes not found",
        message: `The TA/client called to request the activation code for the Energy Biolite Home System. 
I asked for the lamp's serial number and checked the Duka Warranty - Activation Codes (under the Solar Activation Codes tab) to search for the code. 
Unfortunately, the code was unavailable. I advised the client to reach out to DA for further assistance.`,
      },

      {
        label: "🟨 TA Biolite Activation Kit - Demo Lamps",
        message: `The TA called to request the activation code for the TA Biolite - Demo Lamp. 
I asked for the lamp's serial number and checked the TA Biolite Kit Activation - Demo Tracker to search for the code. 
I then read out the activation code to them.`,
      },
      
      
    ],
  },
  "KYC Information Update": {
    template: (data, phone, comment) => `
This macro is used when a client requests to update Name, National ID, or Date of Birth \n  
Correct Client Name: **${data.clientName || ""}**
Correct National ID: **${data.accountNumber || ""}**
Correct Date of Birth: **${data.dob || ""}**
Lead ID: **${data.leadId || ""}**
Territory: **${data.salesTerritory || ""}**
Reason for change:

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 KYC update - successful",
        message: `TA called requesting assistance to update the client's details, as it was captured incorrectly during registration. 
I returned the status back to 'interested in OAF', let the TA make the adjustment then assisted in moving the statuses`,
      },
      {
        label: "🟥 Completed clients - escalate",
        message: `TA called requesting help to update the client's details, as it was captured incorrectly during registration. 
The client was at completed status hence couldn't make the change. Kindly assist.`,
      },
      {
        label: "🟥 Completed clients- ID/Photo - escalate",
        message: `TA called requesting help to update the client's ID photo which was unclear. 
The client was at completed status hence couldn't make the change. Kindly assist.`,
      },
    ],
  },
"USSD / Paybill Service Downtime": {
  template: (data, phone, comment) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-KE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
Client name: **${data.clientName || ""}**  
Phone number: **${data.phoneNumber || ""}**  
Account number: **${data.accountNumber || ""}**  
Service that was being used: **USSD**  
Specific step in the service:  
Specific issue:  
Error message:  
Date and time that user experienced the issue: **${formattedDate} at ${formattedTime}**

Comments:  
Caller Phone: **${phone}**  
${comment}
    `;
  },
  comments: [
    {
      label: "🟪 USSD payment issue",
      message: `Client via TA called regarding a payment issue.  
I apologized and advised her to retry the payment later or consider using the Paybill method as an alternative.  
However, I also informed her that Paybill transactions may incur additional charges.  
If the issue persists, further assistance may be required.`,
    },
    {
      label: "🟥 USSD and Paybill issue",
      message: `Client called to report that payments through both USSD and Paybill were not going through.  
I attempted the same on my end and was also unsuccessful.  
I advised the client to be patient as the issue is currently being addressed by the tech team, and to try again later.`,
    },
  ],
},
  "Over-payment Transfer Request": {
    template: (data, phone, comment) => `
The client called to request for an overpayment transfer of Ksh (      )    
Lead ID: **${data.leadId || ""}**
Client Name: **${data.clientName || ""}**
National ID: **${data.nationalId || ""}**
Roster Account / Paygops Contract No: 
Amount:
Nature of transfer: PaygOps to PaygOps

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟨 General overpayment transfer request",
        message: `TA called to request an overpayment transfer to ensure the credit score on PaygOps updates correctly. Kindly assist.`,
      },
      {
        label: "🟦 Overpayment transfer with loan balance",
        message: `TA called to request an overpayment transfer to a client's contract. 
The client had a previous loan balance and a pending amount in the system. Kindly deduct the outstanding loan from the pending amount and reconcile the remaining balance to the account to ensure the credit score updates correctly in PaygOps.`,
      },
      {
        label:
          "🟦 Overpayment transfer with loan balance but excess balance on account",
        message: `TA called to request an overpayment transfer. 
        The client has a previous loan balance and a pending amount. 
Kindly deduct the old loan from the pending amount, then use the Ksh  in the account to cover the rest, and reconcile the balance to update the credit score correctly in PaygOps.`,
      },
    ],
  },
  "Awaiting Delivery Fee": {
    template: (data, phone, comment) => `
Lead ID: **${data.leadId || ""}**
Account: **${data.accountNumber || ""}**
Current Status: Awaiting Delivery Fee

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟥 Status stuck at Awaiting Delivery Fee",
        message: `TA called to report that the status was stuck at 'Awaiting Delivery Fee'. 
I assisted by changing the client status from “Check credit score” to “Ready to Start Qualification”. 
Advised TA to refresh the client’s profile on their end after a while if the decision delays.`,
      },
    ],
  },

  "Payment Transfer Request": {
    template: (data, phone, comment) => `
Client called to request transfer of Ksh (      )  
Mpesa Code:
Client Name: **${data.clientName || ""}**
Lead ID: **${data.leadId || ""}**
National ID: **${data.nationalId || ""}**
Repayment Date:
Payment Phone Number: **${data.phoneNumber || ""}**
Payment Amount:
Wrong account paid to:
Correct Account money to be transferred to: **${data.nationalId || ""}**
Mode of payment: USSD

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟥 GL Paid to Wrong Account",
        message: `GL called to report that he made a mistake while making payment for a client and ended up paying to the wrong account. 
Kindly assist in transferring the payment to the right account as described above.`,
      },
      {
        label: "🟪 TA Paid to Wrong Account",
        message: `TA called to report that he made a mistake while making payment for a client and ended up paying to the wrong account. 
Kindly assist in transferring the payment to the right account as described above.`,
      },
      {
        label: "🟨 Client to Wrong Account",
        message: `Client called to report that he made a mistake while making payment and ended up paying to the wrong account. 
Kindly assist in transferring the payment to the right account as described above.`,
      },
    ],
  },

  Refund: {
    template: (data, phone, comment) => `
The farmer is kindly requesting a refund of Kshs (      )  
Mpesa/Transaction Code:
Season: N/A
District: N/A
OAF ID: N/A
Lead ID: **${data.leadId || ""}**
National ID: **${data.nationalId || ""}**
Account No: **${data.accountNumber || ""}**
Program (Roster, Paygops, Fineract- Coast Client): Paygops
Phone Number to receive: **${data.phoneNumber || ""}**  
Mpesa Contact person names: **${data.clientName || ""}**  
Does the phone number provided match the phone number on Roster/PaygOps/Fineract?: Yes/No

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 Refund Request (Confirmed Codes)",
        message: `The client called via requesting a refund. 
I took the necessary details regarding the payment and advised them to be patient, as the refund will be processed within 7 working days. 
I also informed them of the 50/= charge fees that would be deducted.`,
      },
      {
        label: "🟨 Refund Request (Call back with M-Pesa codes)",
        message: `The client called via requesting a refund. 
I advised the client to call back with the correct M-Pesa codes for assistance.`,
      },
      {
        label: "🟥 Refund Request (Only Account Holder Can Request)",
        message: `TA called on behalf of the client to report that the client wanted his payment to be refunded. 
I informed him that the refund can only be requested by the account holders who must also have Mpesa codes.`,
      },
    ],
  },


  "Phone Number Validation (OTP at Enrollment)": {
    template: (data, phone, comment) => `
TA/Client calls to inquire why their client’s status has been moved back to “Interested in OAF” or “OTP failed/ not received”
Account Number: **${data.accountNumber || ""}**
Lead ID: **${data.leadId || ""}**
Client’s Phone Number: **${data.phoneNumber || ""}**

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 OTP Not Received (Initial Report)",
        message: `The client called to report not receiving OTP. 
I advised them to follow SMS troubleshooting steps: check SMS settings, delete old messages, check the spam folder, restart the device, test the SIM in another phone, and ensure promotional messages are activated.`,
      },
      {
        label: "🟥Invalid OTP (Error Entering)",
        message: `TA called to report that the client received the OTP, but it was invalid when entered for phone number validation. 
I confirmed the details and suggested further troubleshooting steps.`,
      },
      {
        label: "🟪 OTP Still Not Received",
        message: `The client reported not receiving the OTP after several attempts. 
I resent the OTP and advised them to contact the TA for confirmation. The client insisted they still did not receive it. 
I suggested troubleshooting steps, but the issue persisted. Kindly assist.`,
      },
    ],
  },

  "Phone Number Validation (OTP at Pick-up)": {
    template: (data, phone, comment) => `
Client called to report that they have not received OTP for deliveries.
Account Number: **${data.accountNumber || ""}**
Lead ID: **${data.leadId || ""}**
Duka Name: ${data.dukaZone || ""}
Territory: **${data.salesTerritory || ""}**
Current phone number as on Paygops: **${data.phoneNumber || ""}**

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 OTP Not Received (Initial Report)",
        message: `DA called to report that the OTP was not received. 
Despite following all SMS troubleshooting steps, the issue persisted. 
Kindly assist in resolving it.`,
      },
      {
        label: "🟪 OTP Received After Troubleshooting",
        message: `DA called to report that the OTP was not received initially. 
I guided him through troubleshooting steps, and the OTP was successfully received.`,
      },
      {
        label: "🟥 OTP Not Received (Resent)",
        message: `Client called to report not receiving OTP. 
I advised them to follow the SMS troubleshooting steps and resent the OTP to the client.`,
      },
      {
        label: "🟨 DA fails to validate OTP",
        message: `DA called to report that status was not moving to awaiting pick-up. 
I checked and realized the OTP was not validated yet and advised the DA to retry validating the OTP.`,
      },
    ],
  },

  "IPRS Validation Issue": {
    template: (data, phone, comment) => `
Client Name: **${data.clientName || ""}**
Account Number: **${data.accountNumber || ""}**
Current Status: **${data.status || ""}**
Comment on the status: **${data.comment || ""}

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟦 NID Mismatch (Status Update)",
        message: `TA called to report "NID not verified" under "Awaiting Loan Approval". 
After reviewing the details, I found a mismatch between PaygOps and the uploaded ID. I advised the TA to correct the information.`,
      },
      {
        label: " 🟩Status Update (Resolved)",
        message: `TA called to report that the status was stuck at "Awaiting Loan Approval" with "NID not verified". 
I adjusted the status to "Interested in OAF" → "Check Credit Score" → "Ready to Start Qualification".`,
      },
      {
        label: "🟥 Status Not Fixed (Escalation)",
        message: `TA called to report the status remained stuck at "Awaiting Loan Approval" with "NID not verified" despite correct details. 
I attempted status adjustment, but the issue persists. Requesting further support.`,
      },
      {
        label: "🟪 IPRS Response Not Received",
        message: `Client/TA called to report the error message "IPRS response not received, please try again in 5 minutes". 
I attempted troubleshooting, but the issue persisted. Kindly assist in resolving it.`,
      },
    ],
  },
  "National ID Photo Validation (OCR at Enrollment)": {
    template: (data, phone, comment) => `
TA/Client calls to inquire why the National ID and photo did not match or OCR Endpoint failed with Error 500
Account Number: **${data.accountNumber || ""}**
Lead ID: **${data.leadId || ""}**
Zone: **${data.dukaZone || ""}**
Current Status: **${data.status || ""}**
Comment on the status: **${data.comment || ""}

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟨 Status Adjustment - Fixed Issue",
        message: `TA called to report an ID verification issue where the National ID and photo did not match. 
I updated the status to ‘Interested in OAF,’ then to ‘Check Credit Score,’ and finally to ‘Ready to Start Qualification.’ 
The issue was successfully resolved.`,
      },
      {
        label: "🟩 Retake/Crop and Reupload",
        message: `TA called to report an ID verification issue. Although the ID photo was visible, it had excess dead space. 
I advised the TA to crop the photo in the gallery and re-upload it.`,
      },
      {
        label: "🟦 Synchronization Issue",
        message: `TA called to report ID photo was not visible. 
I advised to check network, fully sync the tablet, delete the photo, retake it, and save again. The issue was resolved.`,
      },
      {
        label: "🟥 Escalate to Digital Channels",
        message: `TA called and reported that ID and photo did not match despite all troubleshooting. 
The issue was not a synchronization issue and TA indicated that they have taken all the steps but cannot validate the National ID. Kindly assist.`,
      },
      {
        label: "🟪TA to submit OCR Escalation Form ",
        message: `TA reported that ID photo was still invisible after syncing and troubleshooting. 
I advised them to complete and submit the OCR escalation form.`,
      },
    ],
  },

  "Territory Moving": {
    template: (data, phone, comment) => `
TA/DA called to request assistance in moving clients from one territory to another.
Client Name: **${data.clientName || ""}**
Lead ID: **${data.leadId || ""}**
Current TA: ${data.currentTA || ""}
New TA: ${data.newTA || ""}
Current Territory: **${data.salesTerritory || ""}**
New Territory: ${data.newTerritory || ""}
Reason for changing: To be in the same Territory as current TA.

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 Territory Move Request",
        message: `TA called requesting assistance in changing the client’s territory. 
I advised them to reach out to the ZS, who will notify the AC to fill out the territory moving escalation tracker and get RM approval.`,
      },
      {
        label: "🟩 Phone number exists",
        message: `TA called to report that the error phone number was already existing when registering a client. 
I confirmed the client was in a different territory as him. I advised them to reach out to the ZS, who will notify the AC to fill out the territory moving escalation tracker and get RM approval.`,
      },
      {
        label: "🟩 Client to reach to TA for support",
        message: `Client called to request a change in duka pick up point. I advised the client to reach to the TA for support.`,
      },
    ],
  },

  "Client Registration": {
    template: (data, phone, comment) => `
A client calls in to enroll in Tupande. Ask the client for the following details:
Client Name: **${data.clientName || ""}**
County: ${data.county || "N/A"}
Sub County: ${data.subCounty || "N/A"}
Ward: ${data.ward || "N/A"}
PaygOps Client Lead ID: **${data.leadId || ""}**

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 New Client (Within Region)",
        message: `Client called to ask how to register with Tupande. 
I guided them through the process and shared the location of the nearest Tupande Duka using the tracker.
      The Nearest Duka was: `,
      },
      {
        label: "🟨 Returning Client",
        message: `Client inquired about Tupande enrollment. I confirmed they had previously enrolled and referred them to their TA for assistance.`,
      },
      {
        label: "🟥 Client Outside Region",
        message: `Client called to ask how to register, but their area is not covered. 
I informed them there’s no Tupande Duka in the region currently and advised them to stay tuned for future updates.`,
      },
      {
        label: "🟥 Visited Duka - Not Assisted",
        message: `Client claimed they visited the duka for registration but were not assisted. Kindly follow up.`,
      },
      {
        label: "🟪 TA Reporting Lead Already Exists",
        message: `TA reported an issue registering a client. 
I advised them to search for and edit the existing lead, since the client had enrolled previously but didn’t pick products. No need to re-register.`,
      },
    ],
  },
  "Product Availability/Pricing Inquiry": {
    template: (data, phone, comment) => `
A farmer calls to inquire about product availability / Price
Phone number: **${data.phoneNumber}**
National ID: **${data.nationalId || ""}**
Nearest Duka and Region: **${data.dukaZone || ""}**
Products Interested In: ${data.products || ""}
Product Price: ${data.productPrice || ""}

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟦 Product Availability",
        message: `Client called to inquire about product availability of the below products. 
I checked the Product Activation Tracker and confirmed availability of the products. 
Advised the client to visit the Duka for further assistance.`,
      },
      {
        label: "🟨 Pricing Inquiry",
        message: `Client called to inquire about product prices of the below products. 
I verified them on the Regional Pricing Tracker and shared the details. 
Advised the client to visit the nearest Tupande Duka for more help.`,
      },
      {
        label: "🟪 Product Availability and Pricing",
        message: `Client asked about both product availability and pricing of the below products. 
I confirmed the product's availability and shared prices using the Product Activation and Pricing Trackers.
Advised the client to visit the nearest Tupande Duka.`,
      },
    ],
  },

  "Input Validation": {
    template: (data, phone, comment) => `
Lead ID: **${data.leadId || ""}**
National ID: **${data.nationalId || ""}**
Client Name: **${data.clientName || ""}**
Wrong details: ${data.wrongDetails || ""}
Correct details: ${data.correctDetails || ""}

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 Input Inquiry",
        message: `Client called to inquire about the inputs they had signed up for. I read the addons recorded in their account.`,
      },
    ],
  },

  " Input Validation (Completed Status)": {
    template: (data, phone, comment) => `
Farmer called to complain that the Input type, Quantity and Price was wrongly
Lead ID: **${data.leadId || ""}**
National ID: **${data.nationalId || ""}**
Client Name: **${data.clientName || ""}**
Wrong details: ${data.wrongDetails || ""}
Correct details: ${data.correctDetails || ""}

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 Completed client missed some input",
        message: `Client called to complain that they did not receive some of the inputs they had signed up for in the addons. 
The status of the client is completed. Kindly assist.`,
      },
      {
        label: "🟩 Discrepancy in Prices",
        message: `Client called to complain that the price of the product after pick-up differs from the price agreed upon at the time of signing`,
      },
    ],
  },

  "Insurance Drops": {
    template: (data, phone, comment) => `
A client called in to request the removal of insurance add-ons
Lead ID: **${data.leadId || ""}**
National ID: **${data.nationalId || ""}**
Registered Name: **${data.clientName || ""}**
Registered phone number:**${data.phoneNumber || ""}**
Input name (HI/FI): Both

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 Client didn't consent",
        message: `Client called to complain that he didn't consent to the addition of the insurance addons and yet it was still added. 
Kindly assist in verifying the client's claims and adjusting the addons accordingly. I informed the client that the request will be worked on within 3 days`,
      },
      {
        label: "🟥 Client consented but its past 30 days",
        message: `Client called to request dropping of the insurance addon. 
I verified it was past 30 days and apologized and informed client that the request cannot be dropped at the moment coz the details have already been submitted to Turaco.`,
      },
    ],
  },

  "Balance Inquiry": {
    template: (data, phone, comment) => `
Farmer calls to ask about his/her balance which was:
Account Number: **${data.accountNumber || ""}**
Lead ID: **${data.leadId || ""}**
National ID: **${data.nationalId || ""}**

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 Client Balance Inquiry-Paygops",
        message: `Client called to inquire about their balance. 
I guided them on how to check it by dialing *689#, entering their 8-digit account number, and selecting option 2. Also read out the balance.`,
      },
      {
        label: "🟨 TA Roster Balance Inquiry",
        message: `TA called to inquire about the client's loan balance. 
I shared the balance as per the screenshot and also provided the account number with the Paybill details.`,
      },
    ],
  },
  "Crop Health Compensation Inquiry": {
    template: (data, phone, comment) => `
Client called to inquire about crop health compensation.    
Lead ID: **${data.leadId || ""}**
National ID: **${data.nationalId || ""}**
Sales Territory: **${data.salesTerritory || ""}**
Duka of Purchase: ${data.dukaZone || ""}
Phone Number: **${data.phoneNumber || ""}**
Compensated Amount: ${data.compensatedAmount || ""}

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟪 Escalation to Leakey",
        message: `Client called to report that they were eligible for crop compensation but have not been refunded yet. 
I confirmed that the client was on the list as shown below. Kindly assist further.\nTRACKER NAME: [Insert Tracker Name]\nTAB NAME: [Insert Tab Name]`,
      },
      {
        label: "🟥 Not Tracked on Dashboard",
        message: `Client called to inquire about crop health compensation, which they say they qualified for but haven’t received. 
I confirmed the client had not been tracked on the Tupande Crop Health Dashboard. I advised the client to reach out to the TA/DA to fill out the Tupande Crop Health Reporting Form.`,
      },
    ],
  },
  "Germination / Seed Quality Issues": {
    template: (data, phone, comment) => `
Client reported an issue with seed germination or quality.    
Lead ID: **${data.leadId || ""}**
National ID: **${data.nationalId || ""}**
Sales Territory: **${data.salesTerritory || ""}**
Duka of Purchase: ${data.dukaZone || ""}
Specific Product Name: ${data.product || ""}
Seed Type: ${data.seedType || ""}
Seed Lot Number: ${data.seedLotNumber || ""}
Date of Planting: ${data.plantingDate || ""}
Date of Germination: ${data.germinationDate || ""}
Germination Rate: ${data.germinationRate || ""}

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟪 Collect Evidence and Report",
        message: `Client called to report a germination issue. \nI advised the client to provide the seed packet with a clear lot number, the Tupande cash or credit receipt, and any remaining seeds of the affected crop to the TA/DA to assist in completing the Crop Health Reporting Form.`,
      },
      {
        label: "🟩 Already Tracked",
        message: `Client called to report a germination issue. \nI confirmed the client was already listed on the Crop Health Dashboard and asked them to remain patient while awaiting feedback.`,
      },
    ],
  },

  "Product Warranty": {
    template: (data, phone, comment) => `
A client called to report that their product is faulty/solar products display an error 200,400 or 500 request assistance in settings (Language, time);
Mode of payment: Roster, Cash (Duka), Paygops, Fineract (Coast clients): PAYGOPS
Product Serial Number or Phone IMEI:
Year the item was received: 
Product Type (Lamp/Phone or Cookstoves): **LAMP**
Account Number: **${data.nationalId || ""}**
Client phone number: **${data.phoneNumber || ""}**
Has this item been replaced before: **NO**
What is the nature of the problem: **FAULT 200**
Has the item been dropped at the duka?: **NO**
Duka Name where the product has been submitted: **${data.dukaZone || ""}**
When did you submit the product at the duka?: **N/A**
When did the TA collect the product?: **N/A**

Comment:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟪 FAULT 200/400",
        message: `Client called via 254704670675 to report fault 200. I guided her through the process below and the error cleared and the lamp activated successfully.
• Long press buttons 1 and 5 simultaneously without releasing or,
• Press 1 and 5 alternately several times until the error clears.
• Long press button 1 and hold it, then button 5 while releasing until error clears,
• Stop pressing buttons 1 and 5 when the error is cleared, (Note: the lamp will not go off) If error(Fault) 400 clears.`,
      },
      {
        label: "🟩 Submit to Duka",
        message: `Client called to report a faulty solar lamp. \nI advised the client to submit the lamp at the duka for warranty processing.`,
      },
    ],
  },
  "Missed input/credit adjustment": {
    template: (data, phone, comment) => `
This macro will record cases where a client claims to have missed input during deliveries or a PaygOps client / Former staff requests a credit adjustment.
Account Number: **${data.accountNumber || ""}**
OAF ID /Lead ID: **${data.leadId || ""}**
District / Territory: **${data.salesTerritory || ""}**
Year and Season(LR,SR):
Is the product on the Roster / PaygOps: **PAYGOPS**

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 Client Balance Inquiry-Paygops",
        message: `Client/ Former OAF staff called to request credit adjustment. Kindly assist`,
      },
    ],
  },
  "Account Number Request": {
    template: (data, phone, comment) => `
Lead ID:**${data.leadId || ""}**
Client Name:**${data.clientName || ""}**
Phone number:**${data.phoneNumber || ""}**
National ID: **${data.accountNumber || ""}**    
Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟪 Roster Account Number",
        message: `Client called to request for his/her Roster account number. I read to him the account number as shown in the screenshot below.`,
      },
      {
        label: "🟨 Paygops Account Number",
        message: `Client called to request for his/her Paygops account number. I informed client that his account number was his National ID number.`,
      },
    ],
  },
"Delivery Planning Not Working At All": {
  template: (data, phone, comment) => {
    const today = new Date().toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return `
This macro is used to address cases where a TA/DA calls for assistance with delivery planning.  
Lead ID: **${data.leadId || ""}**  
Account Number: **${data.accountNumber || ""}**  
Delivery Planning Date: **${today}**  
Current Status: **${data.status || ""}**  
PaygOps Comment: **${data.comment || ""}**  
Is DA able to pick a date?: **Yes**

Comments:  
Caller Phone: **${phone}**  
${comment}
    `;
  },
  comments: [
    {
      label: "🟪 Escalate - No error but not going through",
      message: `DA called to report that the client's delivery planning was not going through despite the client being on the list and no error is being displayed on PaygOps. Kindly assist.`,
    },
    {
      label: "🟨 ERPLY comment",
      message: `DA called to report that the client's delivery planning was not going through because the comment “Error getting the product stock from ERPLY” kept showing when trying to plan a delivery. Kindly assist.`,
    },
  ],
},
  "Health / Funeral Insurance Registration": {
    template: (data, phone, comment) => `
This macro is used to record cases where clients call to sign up for Health or Funeral Insurance.
Client Full names as per the ID: **${data.clientName || ""}**
National ID:**${data.accountNumber || ""}**
Primary Phone No:**${data.phoneNumber || ""}**
Alternative Phone No:
Date of Birth:**${data.dob || ""}**
Are you on WhatsApp?: **Yes/No**
Language preference to receive SMS messages from Turaco: **English**
Beneficiary 1 Details:(If the client has more than two beneficiaries, duplicate these fields for beneficiary 3,4,5…….)
Full Names:
Date of Birth:
National ID (Beneficiary above 18 yrs):
Relationship status:
Next of Kin Details: For Funeral Insurance ONLY
Full Names:
Date of Birth:
National ID:
Relationship status:

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 Registration",
        message: `Client called to request the HI/FI Insurance. I collected the above details from the client. Kindly assist. `,
      },
    ],
  },
  "Health Insurance": {
    template: (data, phone, comment) => `
A client called in to request the removal of insurance add-ons
The farmer called to follow up on H.I
Client Account no:**${data.accountNumber || ""}**
Lead ID:**${data.leadId || ""}**
Phone number:**${data.phoneNumber || ""}**
Name of person hospitalized: **${data.clientName || ""}**
Date of admission: 
Date claim was filed:

Comments:
Caller Phone: **${phone}**
${comment}
  `,
    comments: [
      {
        label: "🟩 Inquiry on discharge summary",
        message: `Client called to inquire about submitting a discharge summary. 
I advised the client to to take a clear photo of the discharge summary and send it to Turaco via WhatsApp number +254 768 387 245, then wait for Turaco to call them with further instructions. `,
      },
  
    ],
  },
};

export default macros;
