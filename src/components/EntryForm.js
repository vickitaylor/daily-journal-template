import React, { useState, useEffect } from "react"

export const EntryForm = ({ entry, moods, tags, onFormSubmit }) => {
    const [editMode, setEditMode] = useState(false)
    const [updatedEntry, setUpdatedEntry] = useState(entry)
    const [chosenTag, updateTag] = useState([])

    useEffect(() => {
        setUpdatedEntry(entry)
        if ('id' in entry) {
            setEditMode(true)
        }
        else {
            setEditMode(false)
        }
    }, [entry])


    // useEffect to copy the form data, and then combine it with the chosenTag array.  Copied the new array to the updatedEntry, as the POST function sends one entry when the button is clicked (parameter is named entryData on the form submit function).  So copied the entries to save the tags and send as one, when received by the server the server saves the entry and the tags into the correct tables. 
    useEffect(
        () => {
            let copy = {...updatedEntry}
            copy.tags = chosenTag
            setUpdatedEntry(copy)
        },
        [chosenTag]
    )

    const handleControlledInputChange = (event) => {
        /*
            When changing a state object or array, always create a new one
            and change state instead of modifying current one
        */
        const newEntry = { ...updatedEntry }
        newEntry[event.target.name] = event.target.value
        setUpdatedEntry(newEntry)
    }

    const constructNewEntry = () => {
        const copyEntry = { ...updatedEntry }
        copyEntry.moodId = parseInt(copyEntry.moodId)
        if (!copyEntry.date) {
            copyEntry.date = Date(Date.now()).toLocaleString('en-us').split('GMT')[0]
        }
        onFormSubmit(copyEntry)
    }

    return (
        <article className="panel is-info">
            <h2 className="panel-heading">{editMode ? "Update Entry" : "Create Entry"}</h2>
            <div className="panel-block">
                <form style={{ width: "100%" }}>
                    <div className="field">
                        <label htmlFor="concept" className="label">Concept: </label>
                        <div className="control">
                            <input type="text" name="concept" required autoFocus className="input"
                                proptype="varchar"
                                placeholder="Concept"
                                value={updatedEntry.concept}
                                onChange={handleControlledInputChange}
                            />
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="entry" className="label">Entry: </label>
                        <div className="control">
                            <textarea
                                className="textarea"
                                name="entry"
                                value={updatedEntry.entry}
                                onChange={handleControlledInputChange}
                            ></textarea>
                        </div>
                    </div>
                    <div className="field">
                        <label htmlFor="moodId" className="label">Mood: </label>
                        <div className="control">
                            <div className="select">
                                <select name="moodId"
                                    proptype="int"
                                    value={updatedEntry.moodId}
                                    onChange={handleControlledInputChange}>
                                    <option value="0">Select a mood</option>
                                    {moods.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="tagId" className="label">Tags: </label>
                        <div className="control">
                            {tags.map((tag) => {
                                return (
                                    <div>
                                        <input type="checkbox" name="tags" required autoFocus
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    const newEntry = [...chosenTag]
                                                    newEntry.push(tag.id)
                                                    updateTag(newEntry)
                                                }
                                            }
                                            }
                                            value={tag.id}
                                        /> {tag.name}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="field">
                        <div className="control">
                            <button type="submit"
                                onClick={evt => {
                                    evt.preventDefault()
                                    constructNewEntry()
                                }}
                                className="button is-link">
                                {editMode ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </article>
    )
}
