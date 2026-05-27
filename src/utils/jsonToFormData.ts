/**
 * Convert JSON object to FormData
 * 
 * @param obj - Object data
 * @param parentKey - Parent key name
*/
const jsonToFormData = (obj: Record<string, any>, parentKey: string = ""): FormData => {
	const formData = new FormData();

	const process = (value: any, key: string) => {
		if (value === null)
			return;

		if (Array.isArray(value)) {
			const files = value.some((item) => item instanceof File || item instanceof Blob);
			if (files) {
				value.forEach((item) => {
					if (!(item instanceof File || item instanceof Blob))
						return;

					formData.append(key, item);
				});
			} else if (typeof(value) === "object" && !(value instanceof File || value instanceof Blob)) {
				Object.entries(value)
					.forEach(([ k, v ]) => process(v, `${key}[${k}]`));
			} else formData.append(key, value);
			
			return;
		}

		if (typeof(value) === "object" && !(value instanceof File || value instanceof Blob)) {
			Object.entries(value)
				.forEach(([ k, v ]) => process(v, `${key}[${k}]`));
			
			return;
		}

		if (value instanceof File || value instanceof Blob) {
			formData.append(key, value);
			
			return;
		}

		formData.append(key, String(value));
	}

	if (typeof(obj) === "object" && !Array.isArray(obj) && obj !== null) {
		Object.entries(obj)
			.forEach(([ k, v ]) => process(v, parentKey ? `${parentKey}[${k}]` : k));
	} else
		formData.append(parentKey, obj);

	return formData;
}

export default jsonToFormData;