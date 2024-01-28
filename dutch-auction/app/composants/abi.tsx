const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "articleIndex",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "bidder",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "BidPlaced",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "message",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Log",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "AUCTION_DURATION",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "INTERVAL",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "PRICE_DECREMENT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "RESERVE_PRICE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "STARTING_PRICE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "auctions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "currentArticleIndex",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "auctioneer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "auctionStartTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startTimeCurrentAuction",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "string[]",
                "name": "articles",
                "type": "string[]"
            }
        ],
        "name": "createAuction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "auctionIndex",
                "type": "uint256"
            }
        ],
        "name": "getArticleNames",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "auctionIndex",
                "type": "uint256"
            }
        ],
        "name": "getArticles",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "winningBidder",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "closed",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "bought",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "boughtFor",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DutchAuction.Article[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "getAuction",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentArticleIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "auctioneer",
                        "type": "address"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "currentPrice",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "winningBidder",
                                "type": "address"
                            },
                            {
                                "internalType": "bool",
                                "name": "closed",
                                "type": "bool"
                            },
                            {
                                "internalType": "uint256",
                                "name": "bought",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "boughtFor",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct DutchAuction.Article[]",
                        "name": "articles",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "auctionStartTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTimeCurrentAuction",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DutchAuction.Auction",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAuctions",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentArticleIndex",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "auctioneer",
                        "type": "address"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "id",
                                "type": "uint256"
                            },
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "currentPrice",
                                "type": "uint256"
                            },
                            {
                                "internalType": "address",
                                "name": "winningBidder",
                                "type": "address"
                            },
                            {
                                "internalType": "bool",
                                "name": "closed",
                                "type": "bool"
                            },
                            {
                                "internalType": "uint256",
                                "name": "bought",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "boughtFor",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct DutchAuction.Article[]",
                        "name": "articles",
                        "type": "tuple[]"
                    },
                    {
                        "internalType": "uint256",
                        "name": "auctionStartTime",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startTimeCurrentAuction",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DutchAuction.Auction[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "auctionIndex",
                "type": "uint256"
            }
        ],
        "name": "getClosedArticles",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "winningBidder",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "closed",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "bought",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "boughtFor",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DutchAuction.Article[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "auctionIndex",
                "type": "uint256"
            }
        ],
        "name": "getCurrentArticle",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "winningBidder",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "closed",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "bought",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "boughtFor",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DutchAuction.Article",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "auctionIndex",
                "type": "uint256"
            }
        ],
        "name": "getCurrentPrice",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "auctionIndex",
                "type": "uint256"
            }
        ],
        "name": "getElapsedTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "auctionIndex",
                "type": "uint256"
            }
        ],
        "name": "getOpenArticles",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "currentPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "winningBidder",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "closed",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "bought",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "boughtFor",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DutchAuction.Article[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "auctionIndex",
                "type": "uint256"
            }
        ],
        "name": "getStartTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTimeStamp",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "articleIndex",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "auctionIndex",
                "type": "uint256"
            }
        ],
        "name": "placeBid",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "startBlock",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

export default abi;