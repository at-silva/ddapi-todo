import React from "react";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useNewListForm } from "../hooks/ddapi";

export default function NewTodoList(lists, setLists) {
    const { inputs, handleInputChange, handleSubmit, isLoading } = useNewListForm(lists, setLists);

    const validateForm = () => {
        return inputs.title.length > 0;
    }

    return (
        <div className="NewTodoList">
            <h3>New TODO List</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group size="lg" controlId="title">
                    <Form.Label>
                        Title</Form.Label>
                    <input type="title" name="title" className="form-control" onChange={handleInputChange} value={inputs.title} required />
                </Form.Group>
                <LoaderButton block size="lg" type="submit" isLoading={isLoading} disabled={!validateForm()}>
                    Login</LoaderButton>
            </Form>
        </div>
    );
}
