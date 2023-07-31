import { Form } from "react-bootstrap";

const FormTextLabel = ({ inputId, titulo }) => {
    return (
        <Form.Label htmlFor={inputId}>{titulo}:</Form.Label>
    );
}

export default FormTextLabel;