export default function InventoryModule() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Catálogo e Inventario</h1>
        <button className="px-4 py-2 bg-foreground text-background rounded text-sm font-medium hover:bg-foreground/90">
          Nuevo Producto
        </button>
      </div>

      <div className="bg-card border rounded shadow-sm">
        <div className="p-4 border-b flex justify-between">
          <input type="text" placeholder="Filtrar por SKU, nombre, marca..." className="border rounded px-3 py-1.5 w-80 text-sm" />
          <select className="border rounded px-3 py-1.5 text-sm">
            <option>Sede Principal Bogotááá (Paloquemao)</option>
            <option>Sede Medellín (La Bayadera)</option>
            <option>Sede Cali (San Nicolás)</option>
            <option>Consolidado Nacional</option>
          </select>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-accent/50 text-muted-foreground border-b">
            <tr>
              <th className="px-4 py-2 text-left">SKU</th>
              <th className="px-4 py-2 text-left">Producto</th>
              <th className="px-4 py-2 text-left">Categoría</th>
              <th className="px-4 py-2 text-right">Precio Base (COP)</th>
              <th className="px-4 py-2 text-right">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr className="hover:bg-accent/50">
              <td className="px-4 py-3 font-mono text-xs">CEM-ARGOS-50</td>
              <td className="px-4 py-3 font-medium">Cemento Gris Argos Uso General 50kg</td>
              <td className="px-4 py-3">Obra Gris</td>
              <td className="px-4 py-3 text-right">$31,500</td>
              <td className="px-4 py-3 text-right text-green-600 font-bold">1,200</td>
            </tr>
            <tr className="hover:bg-accent/50">
              <td className="px-4 py-3 font-mono text-xs">VAR-CORR-1/2</td>
              <td className="px-4 py-3 font-medium">Varilla Corrugada Sidoc PDR 1/2" 6m</td>
              <td className="px-4 py-3">Aceros y Perfiles</td>
              <td className="px-4 py-3 text-right">$18,500</td>
              <td className="px-4 py-3 text-right text-green-600 font-bold">450</td>
            </tr>
            <tr className="hover:bg-accent/50">
              <td className="px-4 py-3 font-mono text-xs">PIN-KORAZA</td>
              <td className="px-4 py-3 font-medium">Vinilo Koraza Pintuco Exterior 5 Gal</td>
              <td className="px-4 py-3">Acabados</td>
              <td className="px-4 py-3 text-right">$245,000</td>
              <td className="px-4 py-3 text-right text-red-600 font-bold">0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}


