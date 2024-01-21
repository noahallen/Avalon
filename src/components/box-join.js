import { useState } from "react";

const JoinBox = (props) =>{
    const {joinCode, error} = props;


    const handleCreate = async(e) => {
        // prevents reload on submit
        e.preventDefault();

        console.log("handle create")
        // handle create button click 
    }
    const handleJoin = async(e) => {
        // prevents reload on submit
        e.preventDefault();

        
        
        console.log("handle join")
        // handle join button click
    }

    return (
        <div className="box-join">
            {/* "Create a room" button */}
            <form onSubmit={handleCreate} >
                <button>Create a room</button>
            </form>

            {/* "Join the Resistance" code and button entry */}
            <form onSubmit={handleJoin} >
                <h3>Join the Resistance:</h3>
                <input
                    type="text"
                    required
                />
                <button>Join!</button>
            </form>
        </div>
    
    )
}


export default JoinBox;