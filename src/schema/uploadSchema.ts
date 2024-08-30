import * as yup from "yup";

const base64Regex =
	/^data:image\/(jpeg|png|gif|bmp|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/;
export const uploadSchema = yup.object().shape({
	image: yup
		.string()
		.required("Imagem em Base64 é obrigatória")
		.test("is-base64", "Imagem não é uma Base64 válida", (value) => {
			if (!value) return false;
			return base64Regex.test(value);
		}),
	customer_code: yup.string().required("Customer code é obrigatório"),
	measure_datetime: yup
		.date()
		.required("Measure date time é obrigatório")
		.transform((value, originalValue) => {
			return originalValue === "" ? null : value;
		}),
	measure_type: yup
		.string()
		.required("Measure type é obrigatório")
		.oneOf(["WATER", "GAS"], "Valor diferente de WATER ou GAS"),
});
