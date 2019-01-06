package track

type UserAgent struct {
	OS      string
	Device  string
	Browser string
}

type UserInfo struct {
	Name     string
	Email    string
	Gender   string
	AgeRange string
}

type Session struct {
	ID             string
	CampaignID     string
	ContentID      string
	AccessPointID  string
	AccessPointMAC string
	ClientMAC      string
	SiteID         string
	OrgID          string
	CreateTime     uint64
	WatchStartTime uint64
	WatchEndTime   uint64
	JoinTime       uint64
	UserAgent
	UserInfo
}
