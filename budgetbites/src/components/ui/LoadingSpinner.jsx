import './LoadingSpinner.css'

const LoadingSpinner = () => {
    return (
        <div className='loading-spinner'>
            <div className='spinner'></div>
            <p>Loading foods...</p>
        </div>
    )
}

export default LoadingSpinner