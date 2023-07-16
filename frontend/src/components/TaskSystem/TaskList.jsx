import React, {useState, useEffect} from "react"

<<<<<<< HEAD
import axios from "axios";
import { ApiFindTasksBySpaceId } from "../../constants";
=======
import { ApiFindTasksBySpaceAndUserId, router_auth} from "../../constants";
>>>>>>> origin/master


function TaskList({onSelectTask}) {
    const [tasks, setTasks] = useState([]);
    const [taskSelectedIndex, setTaskSelectedIndex] = useState(-1);


    useEffect(() => {
        async function fetchData() {
<<<<<<< HEAD
            const response = await axios.request({
                method: 'POST',
                url: ApiFindTasksBySpaceId,
=======
            const response = await router_auth.request({
                method: 'POST',
                url: ApiFindTasksBySpaceAndUserId,
>>>>>>> origin/master
                headers: {'content-type': 'application/json',},
                data: {
                    spaceId: localStorage.getItem("spaceId")
                },
            });
            // if (isError(response)){
            //     return
            // }
            setTasks(response.data)                 // After one finds the data in the database this is the new value stored in the variable chats
        }

        fetchData();                // the fetch data is run
    }, []);

    const emptyMessage = (tasks.length === 0 && <h1>No tasks found</h1>)

    return (
        <div>
            {emptyMessage}
            <ul className="task-list-group">                    
                {tasks.map((r, index) =>
                    <li className={taskSelectedIndex === index ? "list-group-item active" : "active"}
                        key={r._id}
                        onClick={() => {
                            setTaskSelectedIndex(index);
                            onSelectTask(r._id); // call an external function
                        }}
                    >
                        {r.body}
                    </li>
                )}
            </ul>
        </div>
    )
}

export default TaskList;