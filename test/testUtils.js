import checkPropTypes from 'check-prop-types'

// 透過 data-test 來找到組件中指定的元件
export const findByTestAttr = (wrapper, val) => {
    return wrapper.find(`[data-test='${val}']`)
}

export const checkProps = (component, conformingProps) => {
    const propError = checkPropTypes(
        component.propTypes,
        conformingProps,
        'prop',
        component.name
    )

    expect(propError).toBeUndefined()
}