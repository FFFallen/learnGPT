import axios from 'axios';

export async function sendMessage(message) {
    console.log("Sending message:", message);

    // Send POST request to backend API
    const res = await axios.post("http://localhost:8000/chat", { message });
    return res.data.reply;
}