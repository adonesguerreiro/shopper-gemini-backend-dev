import * as yup from "yup";

export const confirmSchema = yup.object().shape({
	measure_uuid: yup.string().required("Measure UUID é obrigatório"),
	confirmed_value: yup.number().required("Confirmed value é obrigatório"),
});
