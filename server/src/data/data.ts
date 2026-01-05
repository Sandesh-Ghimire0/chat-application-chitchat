export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    messages: Message[];
    isActive: boolean;
    image: string;
}

export interface Message {
    id: string;
    userId: string;
    to: string;
    content: string;
}

const messages: Message[] = [
    {
        id: "msg-1",
        userId: "user-1",
        to: "user-2",
        content: "hello",
    },
    {
        id: "msg-2",
        userId: "user-2",
        to: "user-1",
        content: "Hiiii",
    },
    {
        id: "msg-3",
        userId: "user-2",
        to: "user-1",
        content: "do you need something",
    },
    {
        id: "msg-4",
        userId: "user-3",
        to: "user-2",
        content: "hello 2 from 3",
    },
    {
        id: "msg-5",
        userId: "user-1",
        to: "user-3",
        content: "hello 3333",
    },
];


const user1Msg: Message[] = messages.filter( msg => msg.userId === 'user-1')
const user2Msg: Message[] = messages.filter( msg => msg.userId === 'user-2')
const user3Msg: Message[] = messages.filter( msg => msg.userId === 'user-3')


const users: User[] = [
    {
        id:'user-1',
        username:"Ram kumar",
        email:"ram@gmail.com",
        password:"123456",
        messages: user1Msg,
        isActive: false,
        image:''
    },
    {
        id:'user-2',
        username:"Hari Das",
        email:"hari@gmail.com",
        password:"123456",
        messages: user2Msg,
        isActive: false,
        image:''
    },
    {
        id:'user-3',
        username:"Rita oli",
        email:"rita@gmail.com",
        password:"123456",
        messages: user3Msg,
        isActive: false,
        image:''
    },
    
]


export {
    users,
    messages
}