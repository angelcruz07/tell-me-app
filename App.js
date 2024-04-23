import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Button, TextInput, Text } from 'react-native'
import * as Speech from 'expo-speech'
import { Picker } from '@react-native-picker/picker'
import { Accelerometer } from 'expo-sensors'
import * as Location from 'expo-location'

export default function App() {
	const [selectedAccent, setSelectedAccent] = useState('es')
	const [textToSpeak, setTextToSpeek] = useState('No hay audio')
	const speak = () => {
		Speech.speak(textToSpeak, { language: selectedAccent })
	}
	useEffect(() => {
		const askPermissions = async () => {
			const { status } = await Location.requestForegroundPermissionsAsync()
			if (status !== 'granted') {
				console.error('Permiso de ubicación no concedido')
				return
			}

			const subscription = Accelerometer.addListener((accelerometerData) => {
				const { x, y, z } = accelerometerData

				// Puedes ajustar estos límites según tus necesidades
				const threshold = 1.5 // Umbral de movimiento

				// Verifica si la aceleración en cualquiera de los ejes supera el umbral
				if (
					Math.abs(x) > threshold ||
					Math.abs(y) > threshold ||
					Math.abs(z) > threshold
				) {
					// Si el dispositivo se mueve, detiene la reproducción actual si hay alguna
					Speech.stop()

					// Reproduce el mensaje de advertencia
					Speech.speak('¡no me muevas tio!', {
						language: 'es'
					})
				}
			})

			return () => {
				subscription.remove()
			}
		}

		askPermissions()
	}, [])

	return (
		<View style={styles.container}>
			<View>
				<Text style={{ fontSize: 24, textAlign: 'center' }}>
					Ingresa el texto
				</Text>
				<TextInput
					style={styles.input}
					placeholder='Ingresa el texto a leer'
					onChangeText={setTextToSpeek}
				/>
				<Picker
					selectedValue={selectedAccent}
					onValueChange={(itemValue, itemIndex) =>
						setSelectedAccent(itemValue)
					}>
					<Picker.Item label='Español' value='es' />
					<Picker.Item label='Alemán' value='de' />
					<Picker.Item label='Francés' value='fr' />
					<Picker.Item label='Inglés' value='en' />
					<Picker.Item label='Italiano' value='it' />
					<Picker.Item label='Portugués' value='pt' />
				</Picker>
			</View>
			<Button title='Hablame' onPress={speak} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#ecf0f1',
		padding: 8
	},
	input: {
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		marginBottom: 10,
		padding: 10
	}
})
