import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader({ request, params }: LoaderArgs) {
  return json({
    message: `Hello ${params.name}`,
    request,
  });
}

export async function action({ request }: ActionArgs) {}
