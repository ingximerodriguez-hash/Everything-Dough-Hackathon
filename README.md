# Everything Dough and AI solutions 


# Live Demo
everything-dough-mockup-hackathon.vercel.app


### Challenge  Statement


## Project Overview

Everything Dough is a mobile pizza-making experience business that brings interactive pizza classes directly to customers. The business provides the full setup, including ovens, ingredients, tools, and equipment. If a customer does not have a location, Everything Dough can use its partnership with CoCreate Stamford as a venue option.

The business serves Fairfield County and Westchester County and offers customizable experiences such as kids' birthday parties, private celebrations, corporate team-building events, workshops, coffee tastings, mixology classes, dessert-making add-ons, and apron-decorating activities.

This project proposes an AI-powered CRM, automation workflow, website chatbot, and business dashboard to help Everything Dough reduce manual work, improve customer assistance, increase qualified bookings, and prepare for future expansion into other cities.

## Business Problem

Everything Dough is operated by a small team. Many important administrative tasks are currently handled manually, including customer inquiries, lead follow-up, scheduling, booking management, contracts, event reminders, and post-event communication.

The business already tracks inquiries, bookings, conversions, ghosted leads, and declined opportunities in spreadsheets or CRM-style data. However, this data can be better organized to prioritize leads, improve follow-up, and support smarter decisions.

The business also depends heavily on Google and organic traffic. A key opportunity is to diversify customer acquisition through Instagram, Facebook, TikTok, referrals, partnerships, repeat customers, and website assistance.

## Challenge Statement

How can Everything Dough use AI, CRM automation, chatbot support, and customer data to automate operations, improve response time, increase qualified leads, improve customer retention, and build a scalable system that can support future expansion into new cities?


## Challenge Statement

How can Everything Dough use AI, CRM automation, chatbot support, and customer data to automate operations, improve response time, increase qualified leads, improve customer retention, and build a scalable system that can support future expansion into new cities?

## Main Goal

1. Organize all leads and customers in one place.
2. Use the CRM lead score to prioritize high-potential leads.
3. Automate repetitive customer communication.
4. Re-engage ghosted and declined leads.
5. Add a website chatbot to answer common questions instantly.
6. Track bookings, revenue, and growth.
7. Improve visibility across marketing channels.
8. Prepare the business for expansion into other cities.

## The solution includes five main components:

| Component | Purpose |
|---|---|
| CRM Dashboard | Manage leads, customers, bookings, statuses, and follow-ups |
| CRM Lead Scoring | Use the CRM lead score to prioritize the most valuable leads |
| n8n AI Agent | Automate messages, reminders, contracts, and post-event follow-up |
| Website Chatbot | Answer customer questions instantly and reduce waiting time |
| Business Insights Dashboard | Show revenue, growth, best event types, and marketing performance |
|Integrated a AI Spreadsheet Assistant|The business owner can ask questions|
|Social media reply generator| AI-powered response tool for Instagram/Facebook comments|
|CSV export| Download all leads in a format matching Alexandra's existing spreadsheet

## Recommended CRM Pipeline

1. New inquiry
2. Contacted
3. Proposal sent
4. Follow-up needed
5. Booked
6. Contract sent
7. Event confirmed
8. Event completed
9. Review requested
10. Repeat or referral opportunity
11. Ghosted
12. Declined


The CRM lead score is used to help the owner decide which leads need attention first.

## How the CRM Lead Score Is Used

The system uses the CRM lead score to classify leads into priority levels:

| CRM Lead Score | Priority Level | Recommended Action |
|---:|---|---|
| 80 to 100 | High Priority | Contact immediately |
| 60 to 79 | Medium Priority | Send personalized follow-up |
| 40 to 59 | Low Priority | Add to nurture campaign |
| 0 to 39 | Very Low Priority | Monitor or send occasional promotion |

| Lead Type | CRM Lead Score | Recommendation |
|---|---:|---|
| Corporate event inquiry | 92 | Prioritize immediately |
| Kids birthday party inquiry | 76 | Send package details |
| Ghosted private event lead | 55 | Send re-engagement message |
| Declined lead | 30 | Add to future promotion list |


Using the CRM lead score is better for this version because:

- It is simpler to implement.
- It avoids unnecessary model complexity.
- It is easier for the owner to understand.
- It works better when the business has a small dataset.
- It can be used immediately without training a model.
- It keeps the solution practical for a hackathon or small business demo.

## n8n AI Agent Workflow

The n8n AI agent works as an automation assistant. It does not replace the business owner. It supports the owner by handling repetitive tasks, drafting messages, updating CRM statuses, and triggering reminders.

## Workflow Logic


New lead from website, form, email, chatbot, or spreadsheet
        ↓
CRM record is created or updated
        ↓
CRM lead score is reviewed
        ↓
Lead priority is assigned
        ↓
Recommended next action is created
        ↓
Follow-up message is drafted or sent
        ↓
CRM status is updated
        ↓
Contract, reminder, or follow-up automation runs
        ↓
Dashboard updates revenue, conversion, and growth metrics


## **Chatbot Benefits**

The chatbot helps Everything Dough by:

Reducing manual responses.
Helping customers outside business hours.
Increasing the chance of capturing website visitors.
Improving response speed.
Answering repetitive questions without human intervention.
Sending qualified leads directly to the CRM.
Helping the owner focus on high-value conversations.

## AI Spreadsheet Assistant

The project can include an AI assistant connected to the CRM or spreadsheet. The business owner can ask questions in plain English and receive useful answers.

# Example prompts:

Show me the top 20 leads based on CRM lead score.
Which event type made the most revenue this month?
Which ghosted leads are worth contacting again?
Write a follow-up message for corporate leads who asked about team-building events.
Which marketing channel gives us the highest-value customers?


## Main Resources Used to Build the Solution

The solution was designed using four main resources:

1. Everything Dough Small Business Participant Guide

This document helped define the core business challenge. It explains that Everything Dough is a mobile pizza-making business that brings the full setup to customer locations, serves Fairfield County and Westchester County, and wants to use AI to automate operations, improve lead generation, increase retention, and prepare for scalable growth. :contentReference[oaicite:0]{index=0}

2. Alexandra Pizza Context Document

This document helped identify the real workflow problems: manual administrative work, dependence on Google traffic, lack of visibility across other marketing channels, ghosted and declined leads, and the long-term goal of expanding into different cities. 

3. CRM and Lead Scoring Research

CRM lead scoring was used as a practical alternative . HubSpot’s lead scoring documentation explains that CRM scores can help prioritize contacts, companies, and deals based on record properties or actions, which supports the decision to use the existing CRM lead score instead of training a custom model.

4. Automation and Chatbot Research

n8n documentation was used to design the automation workflow because n8n supports workflow automation, integrations, and AI-powered processes. HubSpot chatbot documentation was also used to support the website chatbot solution, which can help answer repetitive questions, capture leads, and reduce customer waiting time. 


## License

This project is licensed under the MIT License — see the LICENSE file for details.
