"use client";
import MediaComponent from "@/components/media";
import { getMedia } from "@/lib/queries";
import { GetMediaFiles } from "@/types/editor_types";
import { useSession } from "next-auth/react";

import React, { useEffect, useState } from "react";

type Props = {
  userId: string;
};

const MediaBucketTab = (props: Props) => {
  const [data, setdata] = useState<GetMediaFiles>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMedia(props?.userId);
      setdata(response);
    };
    fetchData();
  }, [props.userId]);

  return (
    <div className="h-[900px] overflow-scroll p-4">
      <MediaComponent data={data} userId={props.userId} />
    </div>
  );
};

export default MediaBucketTab;
