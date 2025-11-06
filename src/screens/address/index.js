import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Height, Size20, Width } from "../../constants/scales";
import { Colors, Theme } from "../../constants/setting";
import { ButtonDefault } from "../../components/buttons";
import { TitleColorSmall } from "../../components/titles";
import { SizedBox } from "sizedbox";
import { InputIcon, InputIconMask } from "../../components/inputs";
import * as Mask from "../../utils/marksFormat";
import { cepValidation } from "../../utils/validation";
import { useEffect, useState } from "react";
import { Loading } from "../../components/loading";
import { Error } from "../../components/error";
import { UPDATEADDRESS, UPDATE } from "../../contexts/donor/types";
import { Snackbar } from "react-native-paper";

const REQUIRED_FIELD_ERROR = "Campo Obrigatório";
const INVALID_CEP_ERROR = "CEP inválido";
const GEOCODING_ERROR_TITLE = "Endereço Inválido";
const GEOCODING_ERROR_MESSAGE = "Não foi possível validar o endereço informado. Verifique os dados e tente novamente.";

export const RegisterAddress = ({ data, dispach, closeFunc, idx = -1 }) => {
	const [head, setHead] = useState("Cadastro de Endereço");
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});
	
	// Form fields
	const [formData, setFormData] = useState({
		title: "",
		cep: "",
		street: "",
		num: "",
		city: "",
		state: "",
		neighborhood: "",
		complement: ""
	});

	useEffect(() => {
		if (idx >= 0 && data?.address?.[idx]) {
			const address = data.address[idx];
			setFormData({
				title: address.title,
				cep: address.cep,
				street: address.street,
				num: address.num,
				city: address.city,
				state: address.state,
				neighborhood: address.neighborhood,
				complement: address.complement
			});
			setHead("Edição de Endereço");
		}
	}, [idx, data]);

	const updateField = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: "" }));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		// Validate required fields
		if (!formData.title.trim()) {
			newErrors.title = REQUIRED_FIELD_ERROR;
		}
		if (!formData.street.trim()) {
			newErrors.street = REQUIRED_FIELD_ERROR;
		}
		if (!formData.num.trim()) {
			newErrors.num = REQUIRED_FIELD_ERROR;
		}
		if (!formData.state.trim()) {
			newErrors.state = REQUIRED_FIELD_ERROR;
		}
		if (!formData.city.trim()) {
			newErrors.city = REQUIRED_FIELD_ERROR;
		}
		if (cepValidation(formData.cep)) {
			newErrors.cep = INVALID_CEP_ERROR;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleConfirm = async () => {
		setLoading(true);

		if (!validateForm()) {
			setLoading(false);
			onSaveCallback(true, "Falha na validação. Verifique os dados do endereço.");
			return;
		}

		try {
			const geoData = await getGeoLocation({
				street: formData.street,
				number: formData.num,
				city: formData.city,
				state: formData.state,
				cep: formData.cep
			});

			if (!geoData) {
				setError({
					title: GEOCODING_ERROR_TITLE,
					content: GEOCODING_ERROR_MESSAGE
				});
				setLoading(false);
				onSaveCallback(true, GEOCODING_ERROR_MESSAGE);
				return;
			}

			const newAddress = {
				title: formData.title.trim(),
				cep: formData.cep.trim(),
				num: formData.num.trim(),
				street: formData.street.trim(),
				state: formData.state.trim(),
				city: formData.city.trim(),
				neighborhood: formData.neighborhood.trim(),
				complement: formData.complement.trim(),
				latitude: geoData.latitude,
				longitude: geoData.longitude
			};

			const updatedAddresses = [...data.address];
			if (idx >= 0) {
				updatedAddresses[idx] = newAddress;
			} else {
				updatedAddresses.push(newAddress);
			}

			dispach({ type: UPDATEADDRESS, payload: updatedAddresses });
			dispach({
				type: UPDATE,
				data: { ...data, address: updatedAddresses },
				dispatch: dispach,
				cb: updateCB
			});
		} catch (err) {
			console.error("Error in handleConfirm:", err);
			setError({
				title: "Erro",
				content: "Ocorreu um erro ao processar o endereço."
			});
			setLoading(false);
			onSaveCallback(true, "Ocorreu um erro ao processar o endereço.");
		}
	};

	const updateCB = (status, err) => {
		setLoading(false);
		onSaveCallback(status, err);
		closeFunc();
	};

	const fetchCepInfo = async () => {
		if (!formData.cep) return;

		const cleanCep = formData.cep.replace(/[^0-9]/gi, "");
		if (cleanCep.length !== 8) return;

		try {
			const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
			const data = await response.json();

			if (!data.erro) {
				setFormData(prev => ({
					...prev,
					neighborhood: data.bairro || prev.neighborhood,
					city: data.localidade || prev.city,
					street: data.logradouro || prev.street,
					state: data.uf || prev.state
				}));
			}
		} catch (error) {
			console.error("Erro ao buscar CEP:", error);
		}
	};

	const getGeoLocation = async ({ street, number, city, state, cep }) => {
		try {
			// Normaliza e prepara os dados
			const cleanCep = cep.replace(/[^0-9]/g, "");
			const streetParam = `${number} ${street}`;

			const url = new URL("https://nominatim.openstreetmap.org/search");
			url.searchParams.set("format", "json");
			url.searchParams.set("addressdetails", "1");
			url.searchParams.set("limit", "3");
			url.searchParams.set("street", streetParam);
			url.searchParams.set("city", city);
			url.searchParams.set("state", state);
			url.searchParams.set("postalcode", cleanCep);
			url.searchParams.set("country", "Brasil");

			const response = await fetch(url.toString(), {
				headers: {
					"User-Agent": "donor-app/1.0"
				}
			});

			if (!response.ok) {
				throw new Error(`Erro HTTP ${response.status} - ${response.statusText}`);
			}

			const results = await response.json();

			if (!results.length) {
				console.warn("Nenhum resultado encontrado para o endereço.");
				return null;
			}

			const best = results[0];
			return {
				latitude: best.lat,
				longitude: best.lon,
				display_name: best.display_name,
				type: best.type,
				importance: best.importance
			};
		} catch (error) {
			console.error("Erro ao consultar Nominatim:", error.message);
			return null;
		}
	};

	return (
		<View style={styles.overlay}>
			{loading && <Loading />}
			<Snackbar visible={true} onDismiss={() => setError(false)} duration={5000} style={{ backgroundColor: Colors[Theme][9] }}>
				{error?.content}
			</Snackbar>
			<TouchableOpacity
				style={[styles.overlay, styles.backdrop]}
				onPress={closeFunc}
				activeOpacity={1}
			/>

			<View style={styles.container}>
				<ScrollView showsVerticalScrollIndicator={false}>
					<TitleColorSmall align="center" content={head} />
					<SizedBox vertical={5} />

					<InputIcon
						onChange={(value) => updateField("title", value)}
						value={formData.title}
						placeholder="Digite o título"
						label="Titulo *"
						flexS={0.78}
						errorMsg={errors.title}
					/>

					<View style={styles.row}>
						<InputIconMask
							onChange={(value) => updateField("cep", value)}
							value={formData.cep}
							placeholder="Digite o CEP"
							keyboardType="number-pad"
							label="CEP *"
							mask={Mask.cepMask}
							flexS={0.4}
							errorMsg={errors.cep}
							onBlur={fetchCepInfo}
						/>
						<InputIcon
							onChange={(value) => updateField("num", value)}
							value={formData.num}
							placeholder="Digite o Nº"
							keyboardType="number-pad"
							label="Nº Endereço *"
							flexS={0.35}
							errorMsg={errors.num}
						/>
					</View>

					<InputIcon
						onChange={(value) => updateField("street", value)}
						value={formData.street}
						placeholder="Digite o nome da rua"
						label="Rua *"
						flexS={0.78}
						errorMsg={errors.street}
					/>

					<View style={styles.row}>
						<InputIcon
							onChange={(value) => updateField("state", value)}
							value={formData.state}
							placeholder="Nome do estado"
							label="Estado *"
							flexS={0.375}
							errorMsg={errors.state}
						/>
						<InputIcon
							onChange={(value) => updateField("city", value)}
							value={formData.city}
							placeholder="Nome da cidade"
							label="Cidade *"
							flexS={0.375}
							errorMsg={errors.city}
						/>
					</View>

					<View style={styles.row}>
						<InputIcon
							onChange={(value) => updateField("neighborhood", value)}
							value={formData.neighborhood}
							placeholder="Nome do bairro"
							label="Bairro"
							flexS={0.375}
						/>
						<InputIcon
							onChange={(value) => updateField("complement", value)}
							value={formData.complement}
							placeholder="Ex: Ap. 621, Fundo."
							label="Complemento"
							flexS={0.375}
						/>
					</View>

					<SizedBox vertical={5} />

					<View style={styles.row}>
						<ButtonDefault
							title="Cancelar"
							padding={5}
							width={0.35}
							color={Colors[Theme][8]}
							textColor={Colors[Theme][1]}
							radius={16}
							textSize={Size20 * 0.9}
							fun={closeFunc}
						/>
						<ButtonDefault
							title="Confirmar"
							padding={5}
							width={0.35}
							color={Colors[Theme][2]}
							textColor={Colors[Theme][1]}
							radius={16}
							textSize={Size20 * 0.9}
							fun={handleConfirm}
						/>
					</View>
				</ScrollView>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	overlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		elevation: 1,
		zIndex: 1,
		justifyContent: "center"
	},
	backdrop: {
		backgroundColor: Colors[Theme][4],
		opacity: 0.3,
		alignItems: "center"
	},
	container: {
		position: "absolute",
		elevation: 1,
		zIndex: 1,
		width: Width * 0.9,
		maxHeight: Height * 0.85,
		backgroundColor: Colors[Theme][1],
		alignSelf: "center",
		borderRadius: 10,
		padding: 20,
		alignItems: "center"
	},
	row: {
		width: Width * 0.9 - 45,
		flexDirection: "row",
		justifyContent: "space-between"
	}
});