# Speisekarte

## Overview

Speisekarte is a web application designed to streamline the process of managing recipes, planning meals, and generating shopping lists. Users can save URLs of their favorite recipes, which are then scraped and parsed to extract detailed information such as ingredients and cooking steps. This data is utilized to plan meals for the week and to create an aggregated shopping list, leveraging OpenAI's capabilities to ensure accuracy and efficiency.

## Event Modeling

This application adopts an event-modeling approach to design and implement its functionality. Event modeling helps in visualizing the system's workflow and understanding the interactions between different components based on events. The event model for Speisekarte can be viewed here: ![Event Model](speisekarte-event-model.png).

## Key Features

- **Save Recipe URLs**: Users can submit URLs for recipes they wish to save.
- **Automatic Scraping, Parsing, and Image Generation**: The application scrapes the submitted URLs and uses OpenAI to parse the content, extracting ingredients, steps, and other relevant information.
- **Meal Planning**: Users can plan their meals for the upcoming week, selecting from the parsed recipes.
- **Shopping List Generation**: Based on the week's meal plan, an aggregated shopping list is generated, categorizing items to streamline the shopping experience.

## Technologies Used

- **TypeScript**: The primary programming language used across the backend and frontend, providing type safety and modern JavaScript features.
- **NestJS**: A progressive Node.js framework used for building efficient and scalable server-side applications.
- **React**: A JavaScript library for building user interfaces, used here within the Remix framework to manage routes and server-side rendering.
- **Remix**: A full-stack web framework built on top of React, enhancing its capabilities for building more dynamic web applications.
- **OpenAI API**: Leveraged for parsing recipe content and aggregating shopping list items using natural language processing.
- **Puppeteer**: A Node library which provides a high-level API to control Chrome or Chromium over the DevTools Protocol, used for scraping recipe websites.

## Architecture

The application is structured around a series of events and commands that drive the business logic, reflecting an event-sourced architecture.

#### Features Structure

- **commands.ts**: Define the commands that can mutate the system.
- **controller-model.ts**: The read models used by the controllers/api.
- **controller.ts**: The implementation of the API contract.
- **handler-models.ts**: The read models used when commands are decided and events produced.
- **handler.ts**: The implementation of the command handlers.
- **processor-models.ts**: The read models used by the processor.
- **processor.ts**: System driven logic to react to events and state and produce commands.

## Development and Deployment

To develop locally, you can run the following commands in separate terminal windows:

For the server:
`cd packages/server && npm run dev`

For the webapp:
`cd packages/webapp && npm run dev`

For the db:
You'll need a postgres db.
