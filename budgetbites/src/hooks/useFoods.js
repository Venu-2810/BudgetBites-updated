import { useState, useEffect } from "react"
import axios from 'axios'


const useFoods = () => {
    const [foods, serFoods] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                setLoading(true)
                const response = await axios.get('https://budgetbitesapi.com/foods')
                setFoods(response.data)
            } catch (err) {
                setError('Failed to fetch foods')
            } finally {
                setLoading(false)
            }
        }
        fetchFoods()

    }, [])
    return { foods, loading, error }
}

export default useFoods