import React, { useEffect, useMemo, useState } from "react";
import { useWarband } from "../../../../context/WarbandContext";
// import WbbEditViewFighterSortable from "../modals/WbbEditViewFighterSortable";

interface FighterVM {
    id: string;
    name: string;        // user/custom name if present (can be empty)
    modelName: string;   // model display name
    currentXP: number;
    maxXP: number;
    raw: any;            // original fighter object (handy for other components)
}

interface Props {
    /** Called on any selection change with the full, typed selection array */
    onChange?: (selected: FighterVM[]) => void;

    /** Maximum number of selectable fighters (default: 2) */
    maxSelected?: number;
}

const DEFAULT_MAX_XP = 24;

function isEliteModel(m: any): boolean {
    // Support both method and boolean flag
    if (typeof m?.IsElite === "function") return !!m.IsElite();
    return !!m?.elite;
}

function isActiveModel(m: any): boolean {
    // Support both string state and boolean flag
    const state = m?.State ?? m?.active;
    if (typeof state === "string") return state === "active";
    return !!state;
}

function mapToVM(fighter: any, index: number): FighterVM | null {
    // Your GetFighters() returns objects that (from your examples) expose a `model`
    const m = fighter?.model ?? fighter;
    if (!m) return null;

    const id = String(m.id ?? m.ID ?? m.model ?? index);
    const modelName = String(m.CurModel.GetName() ?? m.CurModel.GetName() ?? "Unknown");

    // Optional user/custom name/nickname if present
    const name: string = m.GetFighterName() as string;

    // XP: support multiple shapes; default to sane values
    const currentXP = Number(m.experience ?? m.Experience ?? 0);
    const maxXP =
        typeof m.MaxExperience === "function"
            ? Number(m.MaxExperience())
            : Number(m.maxExperience ?? DEFAULT_MAX_XP);

    return {
        id,
        name,
        modelName,
        currentXP,
        maxXP,
        raw: fighter,
    };
}

const WbbExploration_Selection_MoonshineStash_Destroy: React.FC<Props> = ({
          onChange,
          maxSelected = 2,
      }) => {
    const { warband } = useWarband();
    const [selected, setSelected] = useState<FighterVM[]>([]);

    if (!warband) return <div>Loading…</div>;

    /** Build the candidate list once per warband change */
    const candidates: FighterVM[] = useMemo(() => {
        const src: any[] = warband?.warband_data?.GetFighters?.() ?? [];

        const filtered = src.filter((f) => {
            const m = f?.model ?? f;
            return isEliteModel(m) && isActiveModel(m);
        });

        const mapped = filtered
            .map(mapToVM)
            .filter((x): x is FighterVM => !!x);

        // De-duplicate by id to be safe
        const seen = new Set<string>();
        const unique: FighterVM[] = [];
        for (const vm of mapped) {
            if (!seen.has(vm.id)) {
                seen.add(vm.id);
                unique.push(vm);
            }
        }
        return unique;
    }, [warband]);

    /** Always notify parent about current selection */
    useEffect(() => {
        onChange?.(selected);
    }, [selected, onChange]);

    function toggle(vm: FighterVM) {
        setSelected((prev) => {
            const exists = prev.some((p) => p.id === vm.id);
            if (exists) {
                return prev.filter((p) => p.id !== vm.id);
            }
            if (prev.length >= maxSelected) {
                return prev; // hard limit reached
            }
            return [...prev, vm];
        });
    }


    return (
        <div className="WbbExploration_Selection_MoonshineStash_Destroy mb-3">
            <div className="fw-bold mb-2">Choose up to {maxSelected} fighters</div>

            {/* Simple checkbox UI – switch to your Sortable component if preferred */}
            {candidates.map((vm) => {
                const isChecked = selected.some((s) => s.id === vm.id);
                const disable = selected.length >= maxSelected && !isChecked;

                return (
                    <div className="form-check" key={vm.id}>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`fighter-${vm.id}`}
                            checked={isChecked}
                            disabled={disable}
                            onChange={() => toggle(vm)}
                        />
                        <label
                            className={`form-check-label`}
                            htmlFor={`fighter-${vm.id}`}
                            style={{ cursor: disable ? "not-allowed" : "pointer" }}
                            title={disable ? `Max ${maxSelected} fighters` : ""}
                        >
                            {/* Show name + model name if custom name exists */}
                            {vm.name && vm.name.trim() !== "" ? (
                                <>
                                    {vm.name} — {vm.modelName}
                                </>
                            ) : (
                                vm.modelName
                            )}{" "}
                            (XP: {vm.currentXP}/{vm.maxXP})
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

export default WbbExploration_Selection_MoonshineStash_Destroy;
