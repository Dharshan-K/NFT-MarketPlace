/** @format */
import Headers from "../scripts/pinata";
export default function Header() {
  return (
    <div>
      <h1>{process.env.NEXT_PUBLIC_PINATA_API_KEY}</h1>
      <h1>
        <Headers />
      </h1>
    </div>
  );
}
