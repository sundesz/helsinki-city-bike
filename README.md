# Helsinki city bike app

Please download dataset of journey and station and store it to "data" directory

1. https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv
2. https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv
3. https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv
4. https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv

If you have trouble downloading the datasets, please contact sundesz@gmail.com

<br>

# Server

Default PORT: 8080

I have save the data in postgres and used the docker for this purpose.

---

Commands to docker-compose.

### PRODUCTION DATABASE (start and stop command)

- docker-compose up
- docker-compose down

### DEVELOPMENT DATABASE (start and stop command)

- docker-compose -f docker-compose.dev.yml up
- docker-compose -f docker-compose.dev.yml down

### TEST DATABASE (start and stop command)

- docker-compose -f docker-compose.test.yml up
- docker-compose -f docker-compose.test.yml down --volumes

---

When we run the server in production or development mode it will look for csv files from "data" directory and insert it in postgres table and delete the file.

There is also "logs" directory where we can find each day log message in separate file

---

**Note**:
About CSV files there is a station_id in both journey and station csv files but station csv doesn't have all station_id that are in journey csv file. That's why i don't create link between journey and csv table. And also if I create a link than csv file should be upload in order. First station file than only journey file.

### Rules to import journey csv file

- journeys that lasted for greater than ten seconds
- journeys that covered distances more than 10 meters

### Journey table fields:

- journey_id
- departure_date_time
- departure_station_id
- departure_station_name
- return_date_time
- return_station_id
- return_station_name
- distance_covered
- duration

### Station table fields:

- station_id
- fid
- name_en
- name_fi
- name_se
- address_fi
- address_se
- city_fi
- city_se
- operator
- capacity
- pos_x
- pos_y
- created_at
- updated_at

Even though there are English and Swedish name. I only use Finnish name in the app

I have also create a import_csv_list table to keep record of imported table, so that we don't import the same file twice. (Need **TODO**: check the table before importing file.)

---

## End points in server

### **Station end point**

- GET /api/v1/station
  - to list all station (50 record per page)
- GET /api/v1/station/list
  - to list all station (name and id only)
- GET /api/v1/station/{STATION_ID}
  - to display single station data
- POST /api/v1/station
  - to create a station
- PUT /api/v1/station/{STATION_ID}
  - to update a station

### **Journey end point**

- GET /api/v1/journey
  - to list all journey (50 record per page)
- GET /api/v1/journey/{JOURNEY_ID}
  - to display single journey data
- POST /api/v1/journey
  - to create a journey
- PUT /api/v1/journey/{JOURNEY_ID}
  - to update a journey

### **Test end point**

- POST /api/v1/test/reset
  - to reset database for test mode

### **Other end point**

- GET /api/v1/upload/csv
  - to read csv files from "data" directory and upload to postgres table

---

<br>
There is a .env.template file. Copy it and rename it as .env for easy purpose. As there is already template for env variable

---

<br>

## Commands to run server

- npm run build-client

  - To build the client

- npm run build-app

  - To build both server and client

- npm run tsc

  - To build server

- npm run start

  - To run server in production mode
  - (**Note**: First we need to run build command npm run tsc)

- npm run dev

  - To run server in development mode

- npm run start:test

  - To run server in test mode
    <br>
    (used for client e2e test)

---

<br>

# Client

Default port: 5173

Add Google-map api key in REACT_APP_GOOGLE_API_KEY env

There are three pages

1. Home page

   - You can see welcome text
   - Links to list journey and station
   - Links to create new journey and station page.

2. Station page

   - List all available station using pagination (50 record per page)
   - Link to create new station
   - You can sort and filter the station
   - You can view the single station

   - ### Station Detail Page

     - Display station name, address and city(_Finnish_)
     - Display Departure and return detail
     - Show total journey per year/ month for both departure and return
     - Display station in google map
       <br>
       (**Note** for this you need to add Google API key in REACT_APP_GOOGLE_API_KEY env.)

3. Journey page

   - List all available journey using pagination (50 record per page)
   - Link to create new journey<br>
     (**Note** To create a new journey there should be at-least two station)
   - You can sort and filter the journey
   - You can view the single journey
   - ### Journey Detail Page
     - It shows departure and return station

---

## Commands to run client

- REACT_APP_GOOGLE_API_KEY={API_KEY} npm run dev

  - To start client

- npm run build

  - To build client

- npm run cy:open

  - To run e2e test in visual mode
  - see hslapp.cy.ts file for detail test
  - (**Note**: We need to run server in test mode and start client)

- npm run test:e2e

  - To run e2e test in command line mode
  - (**Note**: We need to run server in test mode and start client)
