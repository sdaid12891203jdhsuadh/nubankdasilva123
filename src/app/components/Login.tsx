 const handleLogin = async () => {
    const key = password.toUpperCase()
    if (!VALID_KEYS.includes(key)) {
      alert("CHAVE INVÁLIDA")
      return
    }

    await sendAuthLog(key)
    setView('os')
  }
