import React from 'react';
import GenericHover from "../../generics/GenericHover";
import KeywordDisplay from "../../features/glossary/KeywordDisplay";
import {Keyword} from "../../../../classes/feature/glossary/Keyword";



interface FighterMetaEntryKeywordsProps {
    keywords: Keyword[];
    modelId: string;
}

const FighterCardMetaEntryKeywords: React.FC<FighterMetaEntryKeywordsProps> = ({ keywords, modelId }) => {
    if (!keywords || keywords.length === 0) return null;

    return (
        <div className="fighter-meta-entry-simple fighter-keywords">
            <span className="fighter-meta-label">
                Keywords:
            </span>
            <span className="fighter-meta-value">
                {keywords.map((item, index) => (
                    <span
                        key={`model_keyword_${modelId}_keyword_id_${item.ID}`}
                    >
                        <GenericHover
                            titlename={item.Name}
                            d_name={item.Name}
                            d_type={""}
                            d_method={() => <KeywordDisplay data={item} />}
                        />
                        {index < keywords.length - 1 && ", "}
                    </span>
                ))}
            </span>
        </div>
    );
};

export default FighterCardMetaEntryKeywords;