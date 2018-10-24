# Course NOTE: React Testing With Jest And Enzyme

## Install
### using create-react-app to start
Setting up enzyme for create-react-app project
```shell=
# 1.5.2
create-react-app your_project

# 2018/09/05
# jest and jest-cli have to install the specify version otherwise it will throw an errow
npm install --save-dev jest@20.0.4 jest-cli@20.0.4 jest-enzyme enzyme enzyme-adapter-react-16
```

## [Enzyme](https://github.com/airbnb/enzyme)
### Setup
是一套由 Airbnb 開源的測試庫，專門用來測試 React 組件。
需要根據不同的 react 版本使用不同版本的 adapter。

**透過自行設置來啟用 Enzyme**
```javascript=
import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new EnzymeAdapter() })
```

**透過 create-react-app 自動設定**
webpack 會透過`src/setupTests.js`幫我們設定好 Jest。
每次在執行測試前會自動幫我們執行 `setupTests.js`。

如此一來，就不必在寫每一支測試程式前，重複做 import 這些動作。

*(不同的版本好像會有問題，有問題[參考](https://github.com/wmonk/create-react-app-typescript/issues/185#issuecomment-404407963))*
```javascript=
import Enzyme from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new EnzymeAdapter() })
```

### Intro
Enzyme 有 3 種渲染方式：`render`、`mount`、`shallow`。

`render` 是透過第三方庫 Cheerio 來做渲染，渲染結果是普通的 HTML 結構。由於是將 HTML 的字串透過 Cheerio 來解析，所以沒辦法模擬交互的行為，如果有需要交互的測試，還是得透過 `shallow` 和 `mount`，但如果是使用 snapshot 測試，則使用 `render` 比較合適 。

`shallow` 的速度最快，因為只會渲染當前組件，不會渲染其子組件。如果是簡單的測試渲染的元件數量、是否正確的渲染，則使用 `shallow` 就已足夠。

`mount` 則是會完整的渲染出組件以及其所有的子組件，速度最慢效能也消耗的最多。如果要測試完整的交互過程(組件及其子組件)，則 `mount` 是一個合適的選擇。

`shallow` 和 `mount` 的結果是個被封裝的 ReactWrapper，可以進行多種操作。
譬如find()、parents()、children() 等選擇器進行元素查找;
state()、props() 進行數據查找;
setState()、setprops() 操作數據; 
simulate() 模擬事件觸發。

### Coverage （覆蓋率）
> * 函式覆蓋率（Function coverage）：有呼叫到程式中的每一個函式（或副程式）嗎？
> * 指令覆蓋率（Statement coverage）：若用控制流圖表示程式，有執行到控制流圖中的每一個節點嗎？
> * 判斷覆蓋率（Decision coverage）：（和分支覆蓋率不同）[5] 若用控制流圖表示程式，有執行到控制流圖中的每一個邊嗎？例如控制結構中所有IF指令都有執行到邏輯運算式成立及不成立的情形嗎？
> * 條件覆蓋率（Condition coverage）：也稱為謂詞覆蓋（predicate coverage），每一個邏輯運算式中的每一個條件（無法再分解的邏輯運算式）是否都有執行到成立及不成立的情形嗎？條件覆蓋率成立不表示判斷覆蓋率一定成立。
> * 條件/判斷覆蓋率（Condition/decision coverage）：需同時滿足判斷覆蓋率和條件覆蓋率。
> 節錄自[WIKI](https://zh.wikipedia.org/wiki/%E4%BB%A3%E7%A2%BC%E8%A6%86%E8%93%8B%E7%8E%87)


### Writting tests
`Congrats.test.js`

```javascript=
import React from 'react'
import { shallow } from 'enzyme'

import { findByTestAttr, checkProps } from '../test/testUtils'
import Congrats from './Congrats'

const defaultProps = {
    success: false
}

const setup = (props = {}) => {
    const setupProps = { ...defaultProps, ...props}
    return shallow(<Congrats {...setupProps}/>)
}

test('renders without error', () => {
    const wrapper = setup()
    const component = findByTestAttr(wrapper, 'component-congrats')

    expect(component.length).toBe(1)
})

test('renders no text when `success` prop is false', () => {
    const wrapper = setup({ success: false })
    const component = findByTestAttr(wrapper, 'component-congrats')

    expect(component.text()).toBe('')
})

test('renders non-empty congrats message when `success` prop is true', () => {
    const wrapper = setup({ success: true })
    const message = findByTestAttr(wrapper, 'congrats-message')

    expect(message.text().length).not.toBe(0)
})

test('does not throw warning with expected props', () => {
    const expectedProps = { success: true }
    
    checkProps(Congrats, expectedProps)
})
```

`testUtils.js`
將共用方法提取出來，提高複用性。
```javascript=
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
```

`Congrats.js`
```javascript=
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
```
