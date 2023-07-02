import React, {useEffect, useState} from "react";
import axios from "axios";

function SpaceList() {
    const [spaces, setSpaces] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);


    useEffect(() => {
        async function fetchData() {
            const result = await axios.request({
                method: 'POST',
                url: 'http://localhost:5000/api/find-spaces-by-userid',
                headers: {'content-type': 'application/json',},
                data: {userId: localStorage.getItem("userId")},
            });
            setSpaces(result.data)
        }

        fetchData();
    }, []);

    function onSelectSpace(spaceId){
        localStorage.setItem("spaceId", spaceId);
        window.location.reload(false);
    }

    const emptyMessage = (spaces.length === 0 && <h1>No spaces found</h1>)

    return (
        <div>
            {emptyMessage}
            <ul className="list-group">
                {spaces.map((r, index) =>
                    <li className={selectedIndex === index ? "list-group-item active" : "active"}
                        key={r._id}
                        onClick={() => {
                            setSelectedIndex(index);
                            onSelectSpace(r._id);
                        }}
                    >
                        {r.spaceName}
                    </li>
                )}
            </ul>
        </div>
    )
}

export default SpaceList;