import type { User } from "../types/type.js";


export interface Message {
    id: string;
    from: string;
    to: string;
    content: string;
}

const messages: Message[] = [
    {
        id: "msg-1",
        from: "user-1",
        to: "user-2",
        content: "hello",
    },
    {
        id: "msg-2",
        from: "user-2",
        to: "user-1",
        content: "Hiiii",
    },
    {
        id: "msg-3",
        from: "user-2",
        to: "user-1",
        content: "do you need something",
    },
    {
        id: "msg-4",
        from: "user-3",
        to: "user-2",
        content: "hello 2 from 3",
    },
    {
        id: "msg-5",
        from: "user-1",
        to: "user-3",
        content: "hello 3333",
    },
];


// const user1Msg: Message[] = messages.filter( msg => msg.from === 'user-1')
// const user2Msg: Message[] = messages.filter( msg => msg.from === 'user-2')
// const user3Msg: Message[] = messages.filter( msg => msg.from === 'user-3')


const users: User[] = [
    {
        id:'user-1',
        username:"Ram kumar",
        email:"ram@gmail.com",
        password:"123456",
        isOnline: false,
        image:''
    },
    {
        id:'user-2',
        username:"Hari Das",
        email:"hari@gmail.com",
        password:"123456",
        isOnline: false,
        image:''
    },
    {
        id:'user-3',
        username:"Rita oli",
        email:"rita@gmail.com",
        password:"123456",
        isOnline: false,
        image:''
    },
    
]


export {
    users,
    messages
}