export function Database(instance: D1Database) {
  // Safely escape parameters for an SQL query
  function sql(
    parts: TemplateStringsArray,
    ...parameters: (string | number)[]
  ): D1PreparedStatement {
    return instance.prepare(parts.join(" ? ")).bind(...parameters);
  }
  return {
    sql,
    first: async <T>(stmt: D1PreparedStatement) =>
      stmt.first<T>() as Promise<T>,
    run: async <T>(stmt: D1PreparedStatement) => stmt.run<T>(),
    all: async <T>(stmt: D1PreparedStatement) => stmt.all<T>(),
  };
}
