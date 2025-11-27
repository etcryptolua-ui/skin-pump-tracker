import React, {useEffect, useState} from 'react'
import { fetchSkins, analyzeSkin } from '../api'

export default function Dashboard(){
  const [skins, setSkins] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ load() },[])

  async function load(){
    setLoading(true)
    try{ const r = await fetchSkins(); setSkins(r.data || []) }catch(e){ console.error(e); alert('Erro ao buscar API') }
    setLoading(false)
  }

  return (
    <div style={{maxWidth:980, margin:'0 auto'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
        <button onClick={load}>Atualizar</button>
        <div>{loading ? 'Carregando...' : `Skins: ${skins.length}`}</div>
      </div>

      <table>
        <thead><tr><th>Skin</th><th>Preço</th><th>Estoque</th><th>Última</th><th>Ações</th></tr></thead>
        <tbody>
          {skins.map((s:any)=> (
            <tr key={s.skin}>
              <td style={{width:'45%'}}>{s.skin}</td>
              <td>{s.price ?? '-'}</td>
              <td>{s.stock ?? '-'}</td>
              <td>{s.ts ?? '-'}</td>
              <td>
                <button onClick={async ()=> {
                  const res = await analyzeSkin(s.skin);
                  alert(JSON.stringify(res.data));
                }}>Analisar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
