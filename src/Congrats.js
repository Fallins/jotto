import React from 'react'
import PropTypes from 'prop-types'

const Congrats = (props) => {
    if(props.success) {
        return (
            <div data-test='component-congrats'>
                <span data-test='congrats-message'>
                    Congratulations! You Guessed the word!
                </span>
            </div>
        )
    }

    return <div data-test='component-congrats' />
}

Congrats.propTypes = {
    success: PropTypes.bool
}

export default Congrats