# Template-Based Magical Thing

This document was populated with data from Trello.  For example, in the general list, you have a card called "Product Name" and its value is {{ general.product_name }}.  Your "Release Date" is {{ general.release_date }}

## Section 1

Here's the background you entered for Section 1:
**{{ section_1.background }}**

## Section 2

In section 2, you said that **{{ general.client_name }}** has some business goals.  You listed out those goals by making several different cards named "Business Goal" and giving them unique descriptions.  Here's what you put:

{{# section_2.business_goal }}
- {{ . }}
{{/ section_2.business_goal }}

## Section 3

For section three, you listed some goals: {{ section_3.goals }}.
