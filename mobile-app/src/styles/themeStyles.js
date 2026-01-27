export const makeThemeStyles = (colors) => ({
  screen: { flex: 1, backgroundColor: colors.bg },

  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 16,
  },

  title: { fontSize: 18, fontWeight: "900", color: colors.text },

  sub: { fontSize: 13, fontWeight: "700", color: colors.muted },

  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 16,
  },

  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPrimaryText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },
});
