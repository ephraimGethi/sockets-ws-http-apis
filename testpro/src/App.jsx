import { useRef, useState, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import HTMLReactParser from "html-react-parser";
import "./App.css";
import useWebSocket from "react-use-websocket";
import ConversationDetails from "./ConversationDetails";

function App() {
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const [data, setData] = useState([]);
    const [token, setToken] = useState(null);
    const [condetails, setCondetails] = useState({})
    // const conversationId = condetails?.conversation?.id;
    const [conversationId, setConversationId] = useState(null);
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    // Update conversationId when condetails changes
    useEffect(() => {
        if (condetails?.conversation?.id) {
            setConversationId(condetails.conversation.id);
        }
    }, [condetails]);
    // useEffect(() => {
    //     getToken();
    // }, []);

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);
    const getConversation = async (id) => {
        const response = await fetch(`http://127.0.0.1:8000/api/chat/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const res = await response.json()
        setCondetails(res)
        console.log("hello eph", res)
    }
    const fetchData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/chat/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const res = await response.json();
            setData(res);
            console.log(res); // Log response instead of state
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getToken = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/chat/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'username': username,
                    'password': password,
                })
            });
            if (!response.ok) {
                throw new Error('Failed to get token');
            }
            const res = await response.json();
            if (res.access) {
                setToken(res.access);
                // console.log(res.access); 
            }
        } catch (error) {
            console.error("Error getting token:", error);
        }
    };
   
    const config = useMemo(() => ({
        toolbarSticky: false,
        buttons: [
            "bold",
            "italic",
            "underline",
            "|",
            "ul",
            "ol",
            "|",
            "link",
            "|",
            "align",
            "undo",
            "redo",
        ],
    }), []);


    return (
        <div className="container">
            {/* <div className="editor">
                <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    onChange={(newContent) => setContent(newContent)}
                />
                <div>{HTMLReactParser(content)}</div>
            </div> */}
            <div className="chat">
                <h1>Inbox</h1>
                {data && data.map((item, index) => (
                    <div key={index}>
                        <button onClick={() => getConversation(item.id)}>Open Messages</button>
                        <h4>conversation between:</h4> {item.users.map((item, index) => (
                            <div key={index}>
                                <p>{item.username}</p>
                            </div> 
                        ))}
                    </div>
                ))}
            </div>
            <div className="inbox">
                <h1>Messages</h1>
                {conversationId && <ConversationDetails username={username} condetails={condetails} token={token} conversationId={conversationId}/>}
                
            </div>
            <div className="login">
                <h3>Enter Your Credentials To Proceed</h3>
                <input type="text" placeholder="Enter Uername Here..."
                onChange={(e)=>{setUsername(e.target.value)}}
                />
                <input type="password" name="password" placeholder="Enter Password Here..." 
                onChange={(e)=>{setPassword(e.target.value)}}
                />
                <button onClick={()=>{getToken()}}>Submit Credentils</button>
            </div>
        </div>
    );
}

export default App;
