import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'
function Paragarap() {
  const context = useContext(ThemeContext)

  return <p className={context.theme}>cónnsnanssadasnfashdhasdghwqjgjhbdcsamncbaskcghsakujh</p>
}
export default Paragarap
