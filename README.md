I have uploaded the entire project. It can be executed by following the below commands. It runs on docker.

1. Clone/Download the repository.
2. `cd example`
3. `docker-compose up --build`

The application must be up and running. 
1. It first runs the test cases that tests the method written. If any of them fail, then it won't start the application.
2. After the application is running, steps to test.
* In postman or similar application, you can perform get or post calls as provided in the challenge
* Post call: `http://localhost:3000/receipts/process`, with body-raw-json. An Id should be returned. Copy the id.

{
    "id": "03c1c615-6236-468f-9a20-113d07c51a18"
}
* Get call: `http://localhost:3000/receipts/03c1c615-6236-468f-9a20-113d07c51a18/points`, should return points earned by this receipt.

I have tested the code with my knowledge and handled edge cases. Please feel free to test out my code.

Thank you for the challenge. It was fun.