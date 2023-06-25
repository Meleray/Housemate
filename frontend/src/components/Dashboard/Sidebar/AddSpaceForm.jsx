import React, {useState} from "react";
import axios from "axios";

function AddSpaceForm() {
    const [spaceName, setSpaceName] = useState("New space");

    function fetchData() {
        axios.request({
            method: 'POST',
            url: 'http://localhost:5000/api/add-space-and-member',
            headers: {'content-type': 'application/json',},
            data: {
                spaceName: spaceName,
                userId: localStorage.getItem("userId"),
            },
        });
    }

    return (
        <form onSubmit={fetchData}>
            <input
                type="text"
                placeholder="Space name"
                onChange={(e) => setSpaceName(e.target.value)}
            />
            <button>Create new space</button>
        </form>
    )
}

export default AddSpaceForm;