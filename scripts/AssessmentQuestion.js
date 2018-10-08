gRecordData = {
    Status: "NotStarted",
    AssessmentScore: "4",
    VisitedNumberOfPages: "0",
    LastVisitedPage: "", // UserSelectedOptionId will be used to jump to the unattempted question
    RecordTitle: "How Does Barbara Corcoran Pick Her Investments on Shark Tank?",
    LandingPageURL: "record2_landing.htm",
    QuestionSequence: "Numbers", // this can be used later if different display style is required
    OptionSequence: "LowerAlphabets", // this can be used later if different display style is required
    RandomizeQuestions: true,
    RandomizeOptions: true,
    Questions: [
                    {
                        QuestionId: "1",
                        QuestionText: "Which step in the program development cycle involves designing a set of steps to solve a problem?",
                        Options: [
                                     {
                                         "OptionId": "1",
                                         "OptionText": "Defining the problem",
                                         "IsCorrect": false,

                                     },
                                     {
                                         "OptionId": "2",
                                         "OptionText": "An algorithm",
                                         "IsCorrect": true,
                                         "score": 2
                                     },
                                     {
                                         "OptionId": "3",
                                         "OptionText": "A flowchart",
                                         "IsCorrect": false
                                     }

                        ],
                        IsAnswered:false,
                        CorrectFeedback: "That is right. ​",
                        IncorrectFeedback: "​​That is not right. An algorithm is a set of steps to solve a problem.",
                        "UserSelectedOptionId": ""

                    },
                    {
                        QuestionId: "2",
                        QuestionText: "Which step in the program development cycle maps out the logic and processes?",
                        Options: [
                            {
                                "OptionId": "1",
                                "OptionText": "Defining the problem",
                                "IsCorrect": false,

                            },
                            {
                                "OptionId": "2",
                                "OptionText": "An algorithm",
                                "IsCorrect": false,
                            },
                            {
                                "OptionId": "3",
                                "OptionText": "A flowchart",
                                "IsCorrect": true,
                                "score": 2
                            }

                        ],
                        IsAnswered:false,
                        IncorrectFeedback: "That is not right. A flowchart maps out logic and processes.",
                        CorrectFeedback: "That’s right.​",
                        "UserSelectedOptionId": ""

                    },
                    {
                        QuestionId: "3",
                        QuestionText: "Which step in the program development cycle is the process of detecting errors in a program?",
                        Options: [
                            {
                                "OptionId": "1",
                                "OptionText": "An algorithm",
                                "IsCorrect": false,

                            },
                            {
                                "OptionId": "2",
                                "OptionText": "Pseudocode",
                                "IsCorrect": false,
                            },
                            {
                                "OptionId": "3",
                                "OptionText": "Debugging",
                                "IsCorrect": true,
                                "score": 2
                            }

                        ],
                        IsAnswered:false,
                        IncorrectFeedback: "​​​​That is not right. Debugging is the process of detecting errors in a program.",
                        CorrectFeedback: "That’s right.​",
                        "UserSelectedOptionId": ""

                    },
                    {
                        QuestionId: "4",
                        QuestionText: "What is the expression of the steps of an algorithm using English-like statements that focus on logic, not syntax?",
                        Options: [
                            {
                                "OptionId": "1",
                                "OptionText": "Debugging",
                                "IsCorrect": false,

                            },
                            {
                                "OptionId": "2",
                                "OptionText": "Flowchart",
                                "IsCorrect": false,
                            },
                            {
                                "OptionId": "3",
                                "OptionText": "Pseudocode",
                                "IsCorrect": true,
                                "score": 2
                            }

                        ],
                        IsAnswered:false,
                        IncorrectFeedback: "​That is not right. Pseudocode is the expression of the steps in an algorithm using English-like statements.",
                        CorrectFeedback: "That’s right.​",
                        "UserSelectedOptionId": ""

                    }

    ]
}