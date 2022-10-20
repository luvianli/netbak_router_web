const lang_en = {
	
}
Object.assign(lang_en);
	
export function __(text){
	if(text in lang_en)
		return lang_en[text]
	else return text
}

export default {}