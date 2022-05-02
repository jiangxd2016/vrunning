export const isDark = useDark()
export const isDebug = ref(false)
export const positionLeft = ref(false)
export const positiontop = ref(false)
export const toggleDark = useToggle(isDark)
export const toggleDebug = useToggle(isDebug)

export const togglePaneLeft = useToggle(positionLeft)
export const togglePaneTop = useToggle(positiontop)
